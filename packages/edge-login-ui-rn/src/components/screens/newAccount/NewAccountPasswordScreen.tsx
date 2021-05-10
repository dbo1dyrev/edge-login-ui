// @flow
import { EdgePasswordRules } from 'edge-core-js'
import * as React from 'react'
import { KeyboardAvoidingView, View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import {
  validateConfirmPassword,
  validatePassword
} from '../../../actions/CreateAccountActions'
import s from '../../../common/locales/strings'
import * as Styles from '../../../styles/index'
import { Dispatch, RootState } from '../../../types/ReduxTypes'
import { logEvent } from '../../../util/analytics'
import { scale } from '../../../util/scaling'
import { PasswordStatus } from '../../abSpecific/PasswordStatusComponent'
import { Button } from '../../common/Button'
import { FormField } from '../../common/FormField'
import { Header } from '../../common/Header'
import SafeAreaView from '../../common/SafeAreaViewGradient'
import { connect } from '../../services/ReduxStore'

interface OwnProps {}
interface StateProps {
  confirmPassword: string
  confirmPasswordErrorMessage: string
  createPasswordErrorMessage: string
  error: string
  error2: string
  password: string
  passwordStatus: EdgePasswordRules | null
}
interface DispatchProps {
  onBack: () => void
  onDone: () => void
  validateConfirmPassword: (password: string) => void
  validatePassword: (password: string) => void
}
type Props = OwnProps & StateProps & DispatchProps

interface State {
  isProcessing: boolean
  focusFirst: boolean
  focusSecond: boolean
}

class NewAccountPasswordScreenComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isProcessing: false,
      focusFirst: true,
      focusSecond: false
    }
  }

  render() {
    return (
      <SafeAreaView>
        <KeyboardAwareScrollView
          style={styles.screen}
          keyboardShouldPersistTaps="always"
          contentContainerStyle={styles.mainScrollView}
        >
          <Header onBack={this.props.onBack} />
          {this.renderMain()}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    )
  }

  renderMain() {
    if (this.state.focusSecond) {
      return (
        <KeyboardAvoidingView
          style={styles.pageContainer}
          contentContainerStyle={styles.pageContainer}
          behavior="position"
          keyboardVerticalOffset={-150}
        >
          {this.renderInterior()}
        </KeyboardAvoidingView>
      )
    }
    return <View style={styles.pageContainer}>{this.renderInterior()}</View>
  }

  renderInterior() {
    return (
      <View style={styles.innerView}>
        <PasswordStatus />
        <FormField
          value={this.props.password}
          error={this.props.createPasswordErrorMessage}
          secureTextEntry
          returnKeyType="next"
          onChangeText={(password: string) =>
            this.props.validatePassword(password)
          }
          onSubmitEditing={this.handleFocusSwitch}
          testID="passwordInput"
          label={s.strings.password}
          style={styles.inputBox}
          autoFocus={this.state.focusFirst}
        />
        <FormField
          error={this.props.confirmPasswordErrorMessage}
          returnKeyType="go"
          secureTextEntry
          value={this.props.confirmPassword}
          autoFocus={this.state.focusSecond}
          label={s.strings.confirm_password}
          onChangeText={(password: string) =>
            this.props.validateConfirmPassword(password)
          }
          onSubmitEditing={this.handleNext}
          style={styles.inputBox}
          testID="confirmPasswordInput"
        />
        <View style={styles.passwordShim} />
        <Button
          testID="nextButton"
          onPress={this.handleNext}
          downStyle={styles.nextButton.downStyle}
          downTextStyle={styles.nextButton.downTextStyle}
          upStyle={styles.nextButton.upStyle}
          upTextStyle={styles.nextButton.upTextStyle}
          label={s.strings.next_label}
          isThinking={this.state.isProcessing}
          doesThink
        />
      </View>
    )
  }

  handleFocusSwitch = () => {
    this.setState({
      focusFirst: false,
      focusSecond: true
    })
  }

  handleNext = () => {
    this.setState({
      isProcessing: true
    })
    if (!this.props.passwordStatus) {
      // TODO Skip component
      this.setState({
        isProcessing: false
      })
      return
    }
    if (this.props.error !== '' || this.props.error2 !== '') {
      this.setState({
        isProcessing: false
      })
      logEvent(`Signup_Password_Invalid`)
      return
    }
    if (
      this.props.password &&
      this.props.password !== this.props.confirmPassword
    ) {
      this.setState({
        isProcessing: false
      })
      this.props.validateConfirmPassword(this.props.confirmPassword)
      logEvent(`Signup_Password_Invalid`)
      return
    }
    logEvent(`Signup_Password_Valid`)
    this.props.onDone()
  }
}

const styles = {
  screen: { ...Styles.ScreenStyle },
  mainScrollView: {
    position: 'relative',
    width: '100%',
    height: '100%'
  },
  scrollViewContentContainer: {
    alignItems: 'center'
  },
  pageContainer: {
    width: '100%',
    alignItems: 'center',
    flex: 1
  },
  innerView: {
    height: '100%',
    width: '100%',
    alignItems: 'center'
  },
  nextButton: {
    upStyle: Styles.PrimaryButtonUpScaledStyle,
    upTextStyle: Styles.PrimaryButtonUpTextScaledStyle,
    downTextStyle: Styles.PrimaryButtonUpTextScaledStyle,
    downStyle: Styles.PrimaryButtonDownScaledStyle
  },
  inputBox: {
    ...Styles.MaterialInputOnWhiteScaled,
    marginTop: scale(15)
  },
  passwordShim: { width: '100%', height: 1, marginTop: scale(35) }
}

export const NewAccountPasswordScreen = connect<
  StateProps,
  DispatchProps,
  OwnProps
>(
  (state: RootState) => ({
    confirmPassword: state.create.confirmPassword || '',
    confirmPasswordErrorMessage: state.create.confirmPasswordErrorMessage || '',
    createPasswordErrorMessage: state.create.createPasswordErrorMessage || '',
    error: state.create.confirmPasswordErrorMessage || '',
    error2: state.create.createPasswordErrorMessage || '',
    password: state.create.password || '',
    passwordStatus: state.create.passwordStatus
  }),
  (dispatch: Dispatch) => ({
    onBack() {
      dispatch({ type: 'WORKFLOW_BACK' })
    },
    onDone() {
      dispatch({ type: 'WORKFLOW_NEXT' })
    },
    validateConfirmPassword(password: string) {
      dispatch(validateConfirmPassword(password))
    },
    validatePassword(password: string) {
      dispatch(validatePassword(password))
    }
  })
)(NewAccountPasswordScreenComponent)
