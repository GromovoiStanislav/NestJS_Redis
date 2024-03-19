## NestJS with RedisOM

On the tsconfig.json, at the end add esModuleInterop:

```
{
  "compilerOptions": {
    // ...
    "esModuleInterop": true
  }
}
```

#### Using Common library

```
nest g lib redis-client
```