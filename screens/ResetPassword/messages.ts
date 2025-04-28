import {defineMessages} from 'react-intl';

export const messages = defineMessages({
  resetPasswordFor: {
    id: 'resetPassword.resetPasswordFor',
    defaultMessage: 'Reset password for {email}',
  },
  newPasswordPlaceholder: {
    id: 'resetPassword.newPasswordPlaceholder',
    defaultMessage: 'Enter new password',
  },
  resetPassword: {
    id: 'resetPassword.resetPassword',
    defaultMessage: 'Reset Password',
  },
  checkEmail: {
    id: 'resetPassword.checkEmail',
    defaultMessage: 'Please check your email ({email}) for a password reset link.',
  },
  error: {
    id: 'resetPassword.error',
    defaultMessage: 'Error',
  },
  noToken: {
    id: 'resetPassword.noToken',
    defaultMessage: 'Please click the link in your email to reset your password.',
  },
  success: {
    id: 'resetPassword.success',
    defaultMessage: 'Success',
  },
  successReset: {
    id: 'resetPassword.successReset',
    defaultMessage: 'Password reset successfully.',
  },
  subtitle: {
    id: 'resetPassword.subtitle',
    defaultMessage: 'Please enter the new password',
  },
  errorDefault: {
    id: 'resetPassword.errorDefault',
    defaultMessage: 'Something went wrong.',
  },
});