import {Module} from '@nestjs/common';
import {SubscriberService} from "./subscriber.service";

@Module({
    imports: [],
    controllers: [],
    providers: [SubscriberService],
})
export class SubscriberModule {
}
