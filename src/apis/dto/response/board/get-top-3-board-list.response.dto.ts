import { BoardListItem } from "types";
import ResponseDto from "..";

export default interface GetTop3BardListResponseDto extends ResponseDto {

    top3List: BoardListItem[];

}