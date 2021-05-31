// @flow

import * as React from 'react'
import { TouchableOpacity, View } from 'react-native'
import {
  type TextFieldProps,
  // $FlowFixMe = OutlinedTextField is not recognize by flow
  OutlinedTextField,
  TextField
} from 'react-native-material-textfield'
import { cacheStyles } from 'react-native-patina'
import AntDesignIcon from 'react-native-vector-icons/AntDesign'

import { fixSides, mapSides, sidesToMargin } from '../../util/sides'
import {
  type Theme,
  type ThemeProps,
  withTheme
} from '../services/ThemeContext'

type Props = {|
  ...TextFieldProps,
  ...ThemeProps,
  marginRem?: number | number[]
|}

class EdgeTextFieldComponent extends React.PureComponent<Props> {
  render() {
    const { theme, marginRem, ...rest } = this.props

    return (
      <TextField
        containerStyle={sidesToMargin(
          mapSides(fixSides(marginRem, 0.5), theme.rem)
        )}
        fontSize={theme.rem(1)}
        labelFontSize={theme.rem(0.75)}
        baseColor={theme.primaryText}
        errorColor={theme.dangerText}
        textColor={theme.primaryText}
        tintColor={theme.primaryText}
        {...rest}
      />
    )
  }
}

export const EdgeTextField = withTheme(EdgeTextFieldComponent)

type EdgeOutlinedTextFieldProps = {
  fieldRef?: ?React.ElementRef<typeof OutlinedTextField>,
  marginRem?: number | number[],
  isClearable: boolean,
  small?: boolean,
  hideSearchIcon?: boolean,
  onClear: () => void
}

class EdgeTextFieldOutlinedComponent extends React.PureComponent<
  EdgeOutlinedTextFieldProps & ThemeProps
> {
  handleClearText = () => {
    const { fieldRef, onClear } = this.props
    if (fieldRef && fieldRef.current) {
      fieldRef.current.clear()
      onClear()
    }
  }

  render() {
    const {
      isClearable,
      marginRem,
      small,
      theme,
      hideSearchIcon,
      ...rest
    } = this.props
    const spacings = sidesToMargin(
      mapSides(fixSides(marginRem, 0.5), theme.rem)
    )
    const styles = getStyles(theme)
    const contentInset = small ? { input: theme.rem(0.75), label: 0 } : null

    return (
      <View style={styles.outlinedTextFieldContainer}>
        <OutlinedTextField
          containerStyle={[spacings, styles.outlinedTextField]}
          contentInset={contentInset}
          baseColor={theme.secondaryText}
          errorColor={theme.dangerText}
          textColor={theme.primaryText}
          tintColor={theme.linkText}
          ref={this.props.fieldRef}
          prefix={
            hideSearchIcon ? null : (
              <AntDesignIcon
                name="search1"
                color={theme.iconDeactivated}
                size={theme.rem(1)}
              />
            )
          }
          suffix={
            isClearable && (
              <TouchableOpacity
                onPress={this.handleClearText}
                style={styles.outlinedTextFieldClearContainer}
              >
                <AntDesignIcon
                  name="close"
                  color={theme.icon}
                  size={theme.rem(1)}
                />
              </TouchableOpacity>
            )
          }
          {...rest}
        />
      </View>
    )
  }
}

const getStyles = cacheStyles((theme: Theme) => ({
  outlinedTextFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: theme.rem(4.5),
    position: 'relative'
  },
  outlinedTextField: {
    flex: 1
  },
  outlinedTextInput: {
    paddingLeft: theme.rem(2)
  },
  outlinedTextFieldClearContainer: {
    paddingTop: theme.rem(0.125)
  }
}))

const EdgeTextFieldOutlinedInner = withTheme(EdgeTextFieldOutlinedComponent)

// $FlowFixMe = forwardRef is not recognize by flow?
export const EdgeTextFieldOutlined = React.forwardRef((props, ref) => <EdgeTextFieldOutlinedInner {...props} fieldRef={ref} />) // eslint-disable-line
