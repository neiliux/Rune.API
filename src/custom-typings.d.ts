///<reference path="../typings/main.d.ts"/>

// VALIDATE
declare function schema(schemaDef: Object): validate.ValidatorObject;

declare namespace validate {
  interface ValidationError {
    path: string;
    message: string;
  }
  interface ValidatorObject {
    validate(obj: any): Array<ValidationError>;
  }
}

declare module 'validate' {
  export = schema;
}

declare namespace scrypt {
  function verifyKdf(valid: string | Buffer, test: string, callback: {(err: string, result: boolean): void; }): void;
  function kdf(password: string, options: any, callback: {(err: string, result: any): void; }): void;
}
// scrypt
declare module 'scrypt' {
  export = {
    verifyKdf: scrypt.verifyKdf,
    kdf: scrypt.kdf
  };
}
