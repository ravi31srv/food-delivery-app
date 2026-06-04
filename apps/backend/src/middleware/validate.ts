import { Request, Response, NextFunction } from "express";
import { validate } from "class-validator";

export function validateBody<T extends object>(DtoClass: new () => T & { from?: (body: any) => T }) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const instance = (DtoClass as any).from
      ? (DtoClass as any).from(req.body)
      : Object.assign(new DtoClass(), req.body);

    const errors = await validate(instance, {
      whitelist: true,
      forbidNonWhitelisted: false,
    });

    if (errors.length > 0) {
      const messages = errors.flatMap((err) => [
        ...Object.values(err.constraints || {}),
        ...(err.children?.flatMap(child =>
          Object.values(child.constraints || {})
        ) ?? [])
      ]);
      res.status(400).json({ message: "Validation failed", errors: messages });
      return;
    }

    req.body = instance;
    next();
  };
}