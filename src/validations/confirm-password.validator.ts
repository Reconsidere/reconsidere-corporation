export abstract  class ConfirmPasswordValidator {
    public static MatchPassword(password: string, confirmPassword: string) {
      if (password != confirmPassword) {
        return false;
      } else {
        return true;
      }
    }
  }
  