import {Module} from '@nestjs/common';
import {PublisherModule} from "./publisher/publisher.module";
import {SubscriberModule} from "./subscriber/subscriber.module";
import {ConfigModule} from "@nestjs/config";
import {GetterModule} from "./getter/getter.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PublisherModule,
        SubscriberModule,
        GetterModule
    ],
    controllers: [],
    providers: [],
})
export class AppModule {
}
