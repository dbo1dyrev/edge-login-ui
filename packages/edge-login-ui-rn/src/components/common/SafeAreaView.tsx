// @flow
import * as React from 'react'
import { SafeAreaView } from 'react-native'

interface Props {
  style?: any
  children: any
}

const SafeAreaViewComponent = ({ style, children }: Props) => {
  return <SafeAreaView style={[style, { flex: 1 }]}>{children}</SafeAreaView>
}

export default SafeAreaViewComponent
