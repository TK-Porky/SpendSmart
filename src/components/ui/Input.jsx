/**
 * Input Component
 * Standardized text input with label and error support
 * @module components/ui/Input
 */
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Spacing, Radius, Typography } from '../../constants';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  editable = true,
  required = false,
  style,
  inputStyle,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry;
  const shouldHideText = isPassword && !showPassword;

  const containerStyles = [
    styles.inputContainer,
    isFocused && styles.inputFocused,
    error && styles.inputError,
    !editable && styles.inputDisabled,
  ];

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <View style={containerStyles}>
        {leftIcon && (
          <Icon
            name={leftIcon}
            size={20}
            color={isFocused ? Colors.primary.main : Colors.neutral[400]}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            (rightIcon || isPassword) && styles.inputWithRightIcon,
            multiline && styles.inputMultiline,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.neutral[400]}
          secureTextEntry={shouldHideText}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          accessibilityLabel={label || placeholder}
          accessibilityHint={helperText}
          accessibilityState={{ disabled: !editable }}
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.rightIconButton}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            <Icon
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={Colors.neutral[400]}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !isPassword && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.rightIconButton}
            disabled={!onRightIconPress}
          >
            <Icon
              name={rightIcon}
              size={20}
              color={isFocused ? Colors.primary.main : Colors.neutral[400]}
            />
          </TouchableOpacity>
        )}
      </View>

      {(error || helperText) && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {error || helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.caption,
    color: Colors.neutral[700],
    marginBottom: Spacing.sm,
    fontWeight: '500',
  },
  required: {
    color: Colors.error,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.input,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border.light,
    minHeight: 48,
  },
  inputFocused: {
    borderColor: Colors.primary.main,
    backgroundColor: Colors.neutral[0],
  },
  inputError: {
    borderColor: Colors.error,
  },
  inputDisabled: {
    backgroundColor: Colors.neutral[100],
    opacity: 0.7,
  },
  input: {
    flex: 1,
    ...Typography.body,
    color: Colors.text.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
  },
  inputWithLeftIcon: {
    paddingLeft: Spacing.xs,
  },
  inputWithRightIcon: {
    paddingRight: Spacing.xs,
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  leftIcon: {
    marginLeft: Spacing.md,
  },
  rightIconButton: {
    padding: Spacing.sm,
    marginRight: Spacing.sm,
  },
  helperText: {
    ...Typography.small,
    color: Colors.neutral[500],
    marginTop: Spacing.xs,
  },
  errorText: {
    color: Colors.error,
  },
});

export default Input;
