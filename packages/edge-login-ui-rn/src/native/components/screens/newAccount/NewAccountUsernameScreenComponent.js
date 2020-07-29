// @flow

import React, { Component } from 'react'
import { View } from 'react-native'
import { connect } from 'react-redux'
import { sprintf } from 'sprintf-js'

import { checkUsernameForAvailabilty } from '../../../../common/actions/CreateAccountActions.js'
import * as Constants from '../../../../common/constants/'
import s from '../../../../common/locales/strings'
import { scale } from '../../../../common/util/scaling.js'
import { type Dispatch, type RootState } from '../../../../types/ReduxTypes.js'
import HeaderConnector from '../../../connectors/componentConnectors/HeaderConnector'
import UsernameConnector from '../../../connectors/componentConnectors/UsernameConnector'
import * as Styles from '../../../styles/index.js'
import { Button } from '../../common'
import T from '../../common/FormattedText.js'
import SafeAreaView from '../../common/SafeAreaViewGradient.js'

type OwnProps = {
  appName: string
}
type StateProps = {
  username: string,
  usernameErrorMessage: string | null
}
type DispatchProps = {
  checkUsernameForAvailabilty(string): void
}
type Props = OwnProps & StateProps & DispatchProps

type State = {
  isProcessing: boolean
}

class NewAccountUsernameScreenComponent extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      isProcessing: false
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props !== prevProps) {
      this.setState({
        isProcessing: false
      })
    }
  }

  render() {
    return (
      <SafeAreaView>
        <View style={NewAccountUsernameScreenStyle.screen}>
          <HeaderConnector style={NewAccountUsernameScreenStyle.header} />
          <View style={NewAccountUsernameScreenStyle.pageContainer}>
            <View style={NewAccountUsernameScreenStyle.instructions}>
              <T style={NewAccountUsernameScreenStyle.instructionsText}>
                {sprintf(
                  s.strings.username_desc,
                  this.props.appName || s.strings.app_name_default
                )}
              </T>
            </View>
            <UsernameConnector
              style={NewAccountUsernameScreenStyle.inputBox}
              onFinish={this.onNextPress}
            />
            <View style={NewAccountUsernameScreenStyle.shim} />
            <Button
              onPress={this.onNextPress.bind(this)}
              downStyle={NewAccountUsernameScreenStyle.nextButton.downStyle}
              downTextStyle={
                NewAccountUsernameScreenStyle.nextButton.downTextStyle
              }
              upStyle={NewAccountUsernameScreenStyle.nextButton.upStyle}
              upTextStyle={NewAccountUsernameScreenStyle.nextButton.upTextStyle}
              label={s.strings.next_label}
              isThinking={this.state.isProcessing}
              doesThink
            />
          </View>
        </View>
      </SafeAreaView>
    )
  }

  onNextPress = () => {
    if (this.props.usernameErrorMessage || !this.props.username) {
      return
    }
    this.setState({
      isProcessing: true
    })
    this.props.checkUsernameForAvailabilty(this.props.username)
  }
}

const NewAccountUsernameScreenStyle = {
  screen: { ...Styles.ScreenStyle },
  header: Styles.HeaderContainerScaledStyle,
  pageContainer: {
    ...Styles.PageContainerWithHeaderStyle,
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

export const NewAccountUsernameScreen = connect(
  (state: RootState): StateProps => ({
    username: state.create.username || '',
    usernameErrorMessage: state.create.usernameErrorMessage
  }),
  (dispatch: Dispatch): DispatchProps => ({
    checkUsernameForAvailabilty(data: string) {
      dispatch(checkUsernameForAvailabilty(data))
    }
  })
)(NewAccountUsernameScreenComponent)
