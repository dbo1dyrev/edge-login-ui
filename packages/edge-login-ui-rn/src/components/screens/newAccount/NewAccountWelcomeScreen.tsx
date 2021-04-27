// @flow
import * as React from 'react'
import { View } from 'react-native'
import { sprintf } from 'sprintf-js'

import * as Assets from '../../../assets/index'
import s from '../../../common/locales/strings'
import * as Constants from '../../../constants/index'
import * as Styles from '../../../styles/index'
import { Branding } from '../../../types/Branding'
import { Dispatch, RootState } from '../../../types/ReduxTypes'
import { logEvent } from '../../../util/analytics'
import { scale } from '../../../util/scaling'
import { ImageHeaderComponent } from '../../abSpecific/ImageHeaderComponent'
import { Button } from '../../common/Button'
import T from '../../common/FormattedText'
import { HeaderBackButton } from '../../common/HeaderBackButton'
import SafeAreaView from '../../common/SafeAreaView'
import { connect } from '../../services/ReduxStore'

interface OwnProps {
  branding: Branding
}
interface DispatchProps {
  onBack: () => void
  onDone: () => void
}
type Props = OwnProps & DispatchProps

interface State {}

class NewAccountWelcomeScreenComponent extends React.Component<Props, State> {
  render() {
    return (
      <SafeAreaView>
        <View style={styles.screen}>
          <View style={styles.row1}>
            <HeaderBackButton
              testID="exitButton"
              onPress={this.props.onBack}
              styles={styles.exitBackButtonStyle}
              label={s.strings.exit}
            />
          </View>
          <View style={styles.row2}>
            <ImageHeaderComponent src={Assets.WELCOME} />
          </View>
          <View style={styles.row3}>
            <T style={styles.instructionsText}>
              {sprintf(
                s.strings.welcome_one,
                this.props.branding.appName || s.strings.app_name_default
              )}
            </T>
          </View>
          <View style={styles.row4} />
          <View style={styles.row5}>
            <T style={styles.callToAction}>{s.strings.start_username}</T>
          </View>
          <View style={styles.row6}>
            <Button
              testID="getStartedButton"
              onPress={this.props.onDone}
              downStyle={styles.nextButton.downStyle}
              downTextStyle={styles.nextButton.downTextStyle}
              upStyle={styles.nextButton.upStyle}
              upTextStyle={styles.nextButton.upTextStyle}
              label={s.strings.get_started}
            />
          </View>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = {
  screen: { ...Styles.ScreenStyle },
  row1: {
    width: '100%',
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: 'row'
  },
  row2: { width: '100%', flex: 4 },
  row3: { width: '100%', flex: 3 },
  row4: { width: '100%', flex: 3 },
  row5: { width: '100%', flex: 1 },
  row6: {
    width: '100%',
    flex: 3,
    alignItems: 'center'
  },
  instructionsText: {
    fontSize: scale(Styles.CreateAccountFont.defaultFontSize),
    fontFamily: Constants.FONTS.fontFamilyRegular,
    color: Constants.GRAY_2,
    textAlign: 'center',
    paddingLeft: scale(20),
    paddingRight: scale(20)
  },
  callToAction: {
    fontSize: scale(Styles.CreateAccountFont.defaultFontSize),
    fontFamily: Constants.FONTS.fontFamilyRegular,
    color: Constants.GRAY_2,
    textAlign: 'center'
  },
  nextButton: {
    upStyle: Styles.PrimaryButtonUpScaledStyle,
    upTextStyle: Styles.PrimaryButtonUpTextScaledStyle,
    downTextStyle: Styles.PrimaryButtonUpTextScaledStyle,
    downStyle: Styles.PrimaryButtonDownScaledStyle
  },
  exitButton: {
    upStyle: { ...Styles.TextOnlyButtonUpScaledStyle, width: null },
    upTextStyle: Styles.TextOnlyButtonTextUpScaledStyle,
    downTextStyle: Styles.TextOnlyButtonTextDownScaledStyle,
    downStyle: Styles.TextOnlyButtonDownScaledStyle
  },
  exitBackButtonStyle: {
    backButton: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    backIconStyle: {
      paddingLeft: scale(10),
      fontSize: scale(22),
      color: Constants.SECONDARY
    },
    sideText: {
      color: Constants.SECONDARY,
      fontSize: scale(18)
    },
    icon: {
      color: Constants.SECONDARY
    },
    default: {
      backgroundColor: Constants.TRANSPARENT,
      color: Constants.SECONDARY
    }
  }
} as const

export const NewAccountWelcomeScreen = connect<{}, DispatchProps, OwnProps>(
  (state: RootState) => ({}),
  (dispatch: Dispatch) => ({
    onBack() {
      dispatch({ type: 'START_LANDING' })
    },
    onDone() {
      logEvent(`Signup_Welcome_Next`)
      dispatch({ type: 'WORKFLOW_NEXT' })
    }
  })
)(NewAccountWelcomeScreenComponent)
