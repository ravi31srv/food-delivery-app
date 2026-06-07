

import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validateOrReject,ValidationError } from 'class-validator';
import { BackendFieldError } from '../types/common.types.js';

export function validateBody(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Convert raw body to DTO instance and validate
      req.body = plainToInstance(dtoClass, req.body);
      await validateOrReject(req.body, { validationError: { target: false } });
      next(); // Data is valid, move to the controller
    } catch (errors) {
          const validationErrors = Array.isArray(errors) ? errors as ValidationError[] : [];

      const fieldErrors = flattenBackendErrors(validationErrors);
      res.status(400).json({status :  false, message: 'Validation failed', errors: fieldErrors });
    }
  };
}


export function flattenBackendErrors(
  errors: ValidationError[],
  parentProperty = ''
): BackendFieldError[] {
  let result: BackendFieldError[] = [];

  for (const error of errors) {
    // Generate path. Handles arrays if index is present (e.g., items.0.name)
    const currentPath = parentProperty 
      ? `${parentProperty}.${error.property}` 
      : error.property;

    // Extract constraints at the current level
    if (error.constraints) {
      result.push({
        field: currentPath,
        messages: Object.values(error.constraints)[0],
      });
    }

    // Recursively drill down into child validation steps
    if (error.children && error.children.length > 0) {
      const childErrors = flattenBackendErrors(error.children, currentPath);
      result = result.concat(childErrors);
    }
  }

  return result;
}



