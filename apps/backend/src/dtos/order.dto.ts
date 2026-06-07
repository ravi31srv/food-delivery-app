import "reflect-metadata";
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, Min, ArrayMinSize } from "class-validator";
import { Type } from "class-transformer";
export class OrderItemDto {
  @IsString()
  @IsNotEmpty({ message: "itemId is required" })
  itemId!: string;

  @IsNumber()
  @Min(1, { message: "quantity must be at least 1" })
  quantity!: number;
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: "customerName is required" })
  customerName!: string;

  @IsString()
  @IsNotEmpty({ message: "customerAddress is required" })
  customerAddress!: string;

  @IsString()
  @IsNotEmpty({ message: "customerPhone is required" })
  customerPhone!: string;


  @IsArray()
@ValidateNested({ each: true })
 @ArrayMinSize(1, { message: 'The items array must contain at least 1 item.' })
@Type(() => OrderItemDto)
items!: OrderItemDto[];

  // static factory to manually transform nested items
  static from(body: any): CreateOrderDto {
    const dto = new CreateOrderDto();
    dto.customerName = body.customerName;
    dto.customerAddress = body.customerAddress;
    dto.customerPhone = body.customerPhone;
    dto.items = (body.items ?? []).map((item: any) => {
      const itemDto = new OrderItemDto();
      itemDto.itemId = item.itemId;
      itemDto.quantity = item.quantity;
      return itemDto;
    });
    return dto;
  }
}

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty({ message: "status is required" })
  status!: string;
}