import { Injectable } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class HttpclientService {

  constructor(
    private http: HttpService
  ) {
  }

  async getAllOreders(): Promise<any> {
    const ordersObs = this.http.get(
      "https://run.mocky.io/v3/1089cb5d-6023-4714-be38-cef9b883dee8"
    );
    return (
      await firstValueFrom(ordersObs)
    ).data;

    // const { data } = await firstValueFrom(this.http.get("https://run.mocky.io/v3/1089cb5d-6023-4714-be38-cef9b883dee8"))
    // return data;
  }


  async getPostComments(postId: number): Promise<any> {
    const { data } = await firstValueFrom(this.http.get(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`))
    return data;
  }
}
