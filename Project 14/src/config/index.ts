import {IConfig} from './interfaces/config.interface';

export function config(): IConfig {
    return {
        port: parseInt(process.env.PORT, 10)
    };
}

export {validationSchema} from './validation.schema';