import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, TextStyle, View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import useStyles from './useStyles'; // Assuming this is a custom hook for styles

import {DropdownProps} from 'react-native-element-dropdown/lib/typescript/components/Dropdown/model';

interface DropdownPropsExtended extends DropdownProps<any> {
  label?: string;
  labelStyle?: TextStyle;
}

const DropdownComponent = ({
  label = '',
  containerStyle = {},
  labelStyle = {},
  style = {},
  placeholderStyle = {},
  selectedTextStyle = {},
  iconStyle = {},
  inputSearchStyle = {},
  data = [],
  maxHeight = 300,
  labelField = 'label',
  valueField = 'value',
  placeholder = 'Select',
  searchPlaceholder = 'Search...',
  search = false,
  value = '',
  disable = false,
  onChange = item => {},
}: DropdownPropsExtended) => {
  const [isFocus, setIsFocus] = useState(false);
  const styles = useStyles();


  return (
    <View style={[styles.container, containerStyle]}>
      <Dropdown
        style={[
          styles.dropdown,
          style,
        ]}
        placeholderStyle={[styles.placeholderStyle, placeholderStyle]}
        selectedTextStyle={[styles.selectedTextStyle, selectedTextStyle]}
        inputSearchStyle={[styles.inputSearchStyle, inputSearchStyle]}
        iconStyle={[styles.iconStyle, iconStyle]}
        data={Array.isArray(data) ? data : []}
        search={search}
        maxHeight={maxHeight}
        labelField={labelField}
        itemTextStyle={[styles.itemTextStyle]} // Adjusted itemTextStyle
        valueField={valueField}
        placeholder={!isFocus ? placeholder : ''}
        searchPlaceholder={searchPlaceholder}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          onChange(item);
          setIsFocus(false);
        }}
        selectedTextProps={{selectionColor: 'red', numberOfLines: 1}}
        iconColor={disable?"transparent":'grey'}
     
        disable={disable}
      />
    </View>
  );
};

export default DropdownComponent;
