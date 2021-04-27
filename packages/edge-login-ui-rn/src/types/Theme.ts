// @flow
type FontWeight =
  | 'normal'
  | 'bold'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'

export interface Theme {
  // The app scaling factor, which is the height of "normal" text:
  rem: (size: number) => number

  pressedOpacity: number
  fontFamily: string
  fontWeightBold: FontWeight

  // Background colors:
  backgroundGradientLeft: string
  backgroundGradientRight: string

  // Modal:
  modal: string
  modalShadow: string
  modalBlurType: 'light' | 'dark'

  // Text colors:
  primaryText: string
  secondaryText: string
  dangerText: string
  warningText: string
  linkText: string

  // Tile:
  tileBackground: string

  // Button colors:
  primaryButtonOutline: string
  primaryButton: string
  primaryButtonText: string

  secondaryButtonOutline: string
  secondaryButton: string
  secondaryButtonText: string

  alertModalPrimaryButtonOutline: string
  alertModalPrimaryButton: string
  alertModalPrimaryButtonText: string

  alertModalTertiaryButtonOutline: string
  alertModalTertiaryButton: string
  alertModalTertiaryButtonText: string

  // Dropdown colors:
  dropdownWarning: string
  dropdownError: string
  dropdownText: string

  // Security alert modal:
  securityAlertModalBackground: string
  securityAlertModalHeaderCircle: string
  securityAlertModalHeaderIcon: string
  securityAlertModalDangerIcon: string
  securityAlertModalWarningIcon: string
  securityAlertModalRowBorder: string
  securityAlertModalText: string
}
