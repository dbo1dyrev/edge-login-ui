// @flow

import { type EdgeAccount, type EdgePendingVoucher } from 'edge-core-js'
import * as React from 'react'
import { ActivityIndicator, ScrollView, View } from 'react-native'
import { cacheStyles } from 'react-native-patina'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { completeResecure } from '../../../actions/LoginCompleteActions.js'
import s from '../../../common/locales/strings.js'
import { type Dispatch, type RootState } from '../../../types/ReduxTypes.js'
import { getAccount } from '../../../util/selectors.js'
import { showError } from '../../services/AirshipInstance.js'
import { connect } from '../../services/ReduxStore.js'
import {
  type Theme,
  type ThemeProps,
  withTheme
} from '../../services/ThemeContext.js'
import { IconHeaderRow } from '../../themed/IconHeaderRow.js'
import { LinkRow } from '../../themed/LinkRow.js'
import { PrimaryButton } from '../../themed/ThemedButtons.js'
import { ThemedScene } from '../../themed/ThemedScene.js'
import { MessageText, Warning } from '../../themed/ThemedText.js'

type OwnProps = {}
type StateProps = {
  account: EdgeAccount
}
type DispatchProps = {
  startResecure(account: EdgeAccount): void,
  onDone(): void
}
type Props = OwnProps & StateProps & DispatchProps & ThemeProps

type State = {
  needsResecure: boolean,
  otpResetDate: Date | void,
  pendingVouchers: EdgePendingVoucher[],
  showSkip: boolean,
  spinDeny: boolean,
  spinReset: boolean,
  spinVoucher: { [voucherId: string]: boolean }
}

export class SecurityAlertsScreenComponent extends React.Component<
  Props,
  State
> {
  cleanups: Array<() => mixed> | void

  constructor(props: Props) {
    super(props)
    const { otpResetDate, pendingVouchers = [] } = props.account
    this.state = {
      needsResecure: props.account.recoveryLogin,
      otpResetDate: otpResetDate != null ? new Date(otpResetDate) : undefined,
      pendingVouchers,
      showSkip: false,
      spinDeny: false,
      spinReset: false,
      spinVoucher: {}
    }
  }

  componentDidMount() {
    const { account } = this.props
    this.cleanups = [
      account.watch('otpResetDate', otpResetDate => {
        const date = otpResetDate != null ? new Date(otpResetDate) : undefined
        this.setState({ otpResetDate: date }, this.checkEmpty)
      }),
      account.watch('pendingVouchers', pendingVouchers =>
        this.setState({ pendingVouchers }, this.checkEmpty)
      )
    ]
  }

  componentWillUnmount() {
    if (this.cleanups != null) this.cleanups.forEach(f => f())
  }

  render() {
    const { otpResetDate, pendingVouchers, showSkip, spinDeny } = this.state

    const count = pendingVouchers.length + (otpResetDate != null ? 1 : 0)

    return (
      <ThemedScene>
        <ScrollView style={{ flex: 1 }}>
          <IconHeaderRow
            renderIcon={theme => (
              <FontAwesome name="exclamation-triangle" size={theme.rem(2.5)} />
            )}
          >
            <MessageText>
              {count > 1
                ? s.strings.alert_screen_message_many
                : s.strings.alert_screen_message}
            </MessageText>
          </IconHeaderRow>
          <MessageText>
            <Warning>{s.strings.alert_screen_warning}</Warning>
          </MessageText>
          {this.renderVouchers()}
          {this.renderReset()}
          {showSkip ? (
            <LinkRow
              label={s.strings.skip_button}
              onPress={this.handleSkip}
              renderIcon={() => null}
            />
          ) : null}
        </ScrollView>
        {spinDeny ? (
          <PrimaryButton marginRem={1} spinner />
        ) : (
          <PrimaryButton
            label={s.strings.alert_screen_deny}
            marginRem={1}
            onPress={this.handleDeny}
          />
        )}
      </ThemedScene>
    )
  }

  renderReset(): React.Node {
    const { theme } = this.props
    const { otpResetDate, spinReset } = this.state
    const styles = getStyles(theme)

    if (otpResetDate == null) return null

    return (
      <View style={styles.tile}>
        <MessageText>{s.strings.alert_screen_reset_message}</MessageText>
        <MessageText>
          {s.strings.alert_screen_reset_date}
          {otpResetDate.toLocaleString()}
        </MessageText>
        {spinReset ? (
          <ActivityIndicator
            color={theme.primaryButton}
            style={styles.cardSpinner}
          />
        ) : (
          <LinkRow
            label={s.strings.alert_screen_approve}
            onPress={this.handleApproveReset}
            renderIcon={theme => (
              <AntDesignIcon name="check" size={theme.rem(1)} />
            )}
          />
        )}
      </View>
    )
  }

  renderVouchers(): React.Node {
    const { theme } = this.props
    const { pendingVouchers, spinVoucher } = this.state
    const styles = getStyles(theme)

    return pendingVouchers.map(voucher => (
      <View style={styles.tile} key={voucher.voucherId}>
        <MessageText>
          {voucher.deviceDescription != null
            ? s.strings.alert_screen_device + voucher.deviceDescription + '\n'
            : null}
          {s.strings.alert_screen_ip + voucher.ipDescription + '\n'}
          {s.strings.alert_screen_date + voucher.created.toLocaleString()}
        </MessageText>
        <MessageText>
          {s.strings.alert_screen_reset_date}
          {voucher.activates.toLocaleString()}
        </MessageText>
        {spinVoucher[voucher.voucherId] ? (
          <ActivityIndicator
            color={theme.primaryButton}
            style={styles.cardSpinner}
          />
        ) : (
          <LinkRow
            label={s.strings.alert_screen_approve}
            onPress={() => this.handleApproveVoucher(voucher.voucherId)}
            renderIcon={theme => (
              <AntDesignIcon name="check" size={theme.rem(1)} />
            )}
          />
        )}
      </View>
    ))
  }

  handleApproveReset = () => {
    const { account } = this.props
    this.setState({ spinReset: true })

    account
      .disableOtp()
      .catch(error => showError(error))
      .then(() =>
        this.setState({
          showSkip: true,
          spinReset: false
        })
      )
  }

  handleApproveVoucher = (voucherId: string) => {
    const { account } = this.props
    this.setState(state => ({
      spinVoucher: { ...state.spinVoucher, [voucherId]: true }
    }))

    const { approveVoucher = nopVoucher } = account
    approveVoucher(voucherId)
      .catch(error => showError(error))
      .then(() =>
        this.setState(state => ({
          showSkip: true,
          spinVoucher: { ...state.spinVoucher, [voucherId]: false }
        }))
      )
  }

  handleDeny = () => {
    const { account } = this.props
    const { otpResetDate, pendingVouchers } = this.state
    this.setState({ needsResecure: true, spinDeny: true })

    const { rejectVoucher = nopVoucher } = account
    const promises = pendingVouchers.map(voucher =>
      rejectVoucher(voucher.voucherId)
    )
    if (otpResetDate != null) {
      promises.push(account.cancelOtpReset())
    }

    Promise.all(promises)
      .catch(error => showError(error))
      .then(() =>
        this.setState({
          showSkip: true,
          spinDeny: false
        })
      )
  }

  handleSkip = () => {
    const { onDone } = this.props
    onDone()
  }

  checkEmpty = () => {
    const { account, startResecure, onDone } = this.props
    const { needsResecure, otpResetDate, pendingVouchers } = this.state

    if (otpResetDate == null && pendingVouchers.length <= 0) {
      if (needsResecure) startResecure(account)
      else onDone()
    }
  }
}

function nopVoucher(voucherId: string): Promise<void> {
  return Promise.resolve()
}

const getStyles = cacheStyles((theme: Theme) => ({
  tile: {
    backgroundColor: theme.tileBackground,
    borderRadius: theme.rem(0.5),
    margin: theme.rem(0.5),
    padding: theme.rem(0.5)
  },
  cardSpinner: {
    alignSelf: 'flex-end',
    height: theme.rem(1.5),
    margin: theme.rem(0.5)
  }
}))

export const SecurityAlertsScreen = withTheme(
  connect<StateProps, DispatchProps, OwnProps & ThemeProps>(
    (state: RootState) => ({
      account: getAccount(state)
    }),
    (dispatch: Dispatch) => ({
      startResecure(account) {
        dispatch({ type: 'START_RESECURE', data: account })
      },
      onDone() {
        dispatch(completeResecure())
      }
    })
  )(SecurityAlertsScreenComponent)
)
