// @flow
import * as React from 'react'
import { View } from 'react-native'
import { sprintf } from 'sprintf-js'

import {
  checkUsernameForAvailabilty,
  validateUsername
} from '../../../actions/CreateAccountActions'
import s from '../../../common/locales/strings'
import * as Constants from '../../../constants/index'
import * as Styles from '../../../styles/index'
import { Branding } from '../../../types/Branding'
import { Dispatch, RootState } from '../../../types/ReduxTypes'
import { scale } from '../../../util/scaling'
import { Button } from '../../common/Button'
import T from '../../common/FormattedText'
import { FormField } from '../../common/FormField'
import { Header } from '../../common/Header'
import SafeAreaView from '../../common/SafeAreaViewGradient'
import { connect } from '../../services/ReduxStore'

interface OwnProps {
  branding: Branding
}
interface StateProps {
  username: string
  usernameErrorMessage: string | null
}
interface DispatchProps {
  checkUsernameForAvailabilty: (string) => void
  onBack: () => void
  validateUsername: (username: string) => void
}
type Props = OwnProps & StateProps & DispatchProps

interface State {
  isProcessing: boolean
}

class NewAccountUsernameScreenComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isProcessing: false
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props !== prevProps) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        isProcessing: false
      })
    }
  }

  render() {
    return (
      <SafeAreaView>
        <View style={styles.screen}>
          <Header onBack={this.props.onBack} />
          <View style={styles.pageContainer}>
            <View style={styles.instructions}>
              <T style={styles.instructionsText}>
                {sprintf(
                  s.strings.username_desc,
                  this.props.branding.appName || s.strings.app_name_default
                )}
              </T>
            </View>
            <FormField
              autoCorrect={false}
              autoFocus
              error={this.props.usernameErrorMessage ?? ''}
              label={s.strings.username}
              onChangeText={username => this.props.validateUsername(username)}
              onSubmitEditing={this.handleNext}
              returnKeyType="go"
              style={styles.inputBox}
              testID="usernameInput"
              value={this.props.username}
            />
            <View style={styles.shim} />
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
        </View>
      </SafeAreaView>
    )
  }

  handleNext = () => {
    if (this.props.usernameErrorMessage || !this.props.username) {
      return
    }
    this.setState({
      isProcessing: true
    })
    this.props.checkUsernameForAvailabilty(this.props.username)
  }
}

const styles = {
  screen: { ...Styles.ScreenStyle },
  pageContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center'
  },
  nextButton: {
    upStyle: Styles.PrimaryButtonUpScaledStyle,
    upTextStyle: Styles.PrimaryButtonUpTextScaledStyle,
    downTextStyle: Styles.PrimaryButtonUpTextScaledStyle,
    downStyle: Styles.PrimaryButtonDownScaledStyle
  },
  instructions: {
    width: '90%'
  },
  shim: {
    height: scale(50)
  },
  instructionsText: {
    fontSize: scale(Styles.CreateAccountFont.defaultFontSize),
    fontFamily: Constants.FONTS.fontFamilyRegular,
    color: Constants.GRAY_1,
    textAlign: 'center',
    paddingTop: scale(20),
    paddingBottom: scale(20)
  },
  inputBox: Styles.MaterialInputOnWhite
}

export const NewAccountUsernameScreen = connect<
  StateProps,
  DispatchProps,
  OwnProps
>(
  (state: RootState) => ({
    username: state.create.username || '',
    usernameErrorMessage: state.create.usernameErrorMessage
  }),
  (dispatch: Dispatch) => ({
    onBack() {
      dispatch({ type: 'WORKFLOW_BACK' })
    },
    checkUsernameForAvailabilty(data: string) {
      dispatch(checkUsernameForAvailabilty(data))
    },
    validateUsername(username: string): void {
      dispatch(validateUsername(username))
    }
  })
)(NewAccountUsernameScreenComponent)
