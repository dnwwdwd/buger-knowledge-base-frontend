// 枚举库，暂时未用到，后续版本可能会用到
import type { EnumValue } from '@jsonlee_12138/enum';
import Enum from '@jsonlee_12138/enum';

export const ModelEnum = Enum.create({
  GPT_4o_MINI: Enum.Item('gpt-4o-mini'),
});
export type ModelType = EnumValue<typeof ModelEnum>;
