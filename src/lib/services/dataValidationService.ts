interface ValidationRule {
  field: string;
  validate: (value: any) => boolean;
  message: string;
}

export class DataValidationService {
  private rules: ValidationRule[];

  constructor() {
    this.rules = [
      {
        field: 'population',
        validate: (value) => typeof value === 'number' && value > 0,
        message: 'Population must be a positive number'
      },
      // Add more validation rules
    ];
  }

  validateCityData(data: any) {
    const errors = [];
    for (const rule of this.rules) {
      if (!rule.validate(data[rule.field])) {
        errors.push(rule.message);
      }
    }
    return errors;
  }
} 