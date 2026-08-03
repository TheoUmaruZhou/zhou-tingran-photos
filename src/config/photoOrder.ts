/**
 * 图片排序配置文件
 *
 * 使用说明：
 * 1. 下面的数组按照图片在网站上的显示顺序排列
 * 2. 你可以手动调整数组中图片ID的顺序
 * 3. 注释中包含了图片的标题和路径信息，方便识别
 *
 * 生成时间：2026/8/3 13:02:51
 * 图片总数：89
 */

export const CUSTOM_PHOTO_ORDER: string[] = [
  'img1',  // 中线
  'img2',  // 建
  'img10',  // 通道
  'img5',  // 破墙而出
  'img6',  // 绿皮草
  'img4',  // 建
  'img7',  // 通道 No.4
  'img8',  // 通道 No.5
  'img9',  // 通道 No.6
  'img3',  // 建 No.4 (1)
  'img51',  // 福&庆
  'img53',  // 花椒
  'img54',  // 连接 No.4
  'img42',  // 征服 No.2
  'img56',  // 阳光&菊
  'img23',  // 下乡
  'img24',  // 下乡 No.10
  'img28',  // 下乡 No.14
  'img25',  // 下乡 No.11
  'img29',  // 下乡 No.15
  'img33',  // 下乡 No.5
  'img30',  // 下乡 No.2
  'img31',  // 下乡 No.3
  'img36',  // 下乡 No.8
  'img37',  // 下乡 No.9
  'img38',  // 下乡
  'img26',  // 下乡 No.12
  'img32',  // 下乡 No.4
  'img27',  // 下乡 No.13
  'img34',  // 下乡 No.6
  'img35',  // 下乡 No.7
  'img43',  // 征服
  'img39',  // 乡土
  'img47',  // 椒城 No.3
  'img48',  // 椒城 No.4
  'img40',  // 双向
  'img41',  // 堆 No.2
  'img49',  // 椒城 No.5
  'img44',  // 望向 No.2
  'img55',  // 通道 No.7
  'img50',  // 椒城
  'img52',  // 稻田
  'img45',  // 机器
  'img46',  // 椒城 No.2
  'img182',  // 重力
  'img181',  // 药
  'img179',  // 看
  'img180',  // 看 No.2
  'img178',  // 布置
  'ld1',  // 喵 / Meow
  'ld2',  // 喵 No.2 / Meow No.2
  'ld9',  // 喵 No.10 / Meow No.10
  'ld10',  // 喵 No.11 / Meow No.11
  'ld3',  // 喵 No.3 / Meow No.3
  'ld4',  // 喵 No.4 / Meow No.4
  'ld5',  // 喵 No.5 / Meow No.5
  'ld6',  // 喵 No.6 / Meow No.6
  'ld7',  // 喵 No.8 / Meow No.8
  'ld8',  // 喵 No.9 / Meow No.9
  'ld11',  // 汪 / Wang
  'cc22',  // 驻 No.7
  'cc6',  // 滞留
  'cc9',  // 滞留 No.4
  'cc7',  // 滞留 No.2
  'cc11',  // 滞留 No.6
  'cc1',  // 余音
  'cc12',  // 滞留 No.8
  'cc13',  // 滞留 No.10
  'cc14',  // 滞留 No.11
  'cc3',  // 回升
  'cc8',  // 滞留 No.3
  'cc10',  // 滞留 No.5
  'cc24',  // 驻 No.9
  'cc4',  // 回升 No.2
  'cc5',  // 回升 No.3
  'cc23',  // 驻 No.8
  'cc28',  // 驻 No.13
  'cc26',  // 驻 No.11
  'cc15',  // 滞留 No.12
  'cc29',  // 驻 No.14
  'cc16',  // 驻
  'cc17',  // 驻 No.2
  'cc18',  // 驻 No.3
  'cc19',  // 驻 No.4
  'cc20',  // 驻 No.5
  'cc21',  // 驻 No.6
  'cc25',  // 驻 No.10
  'cc2',  // 回
  'cc27',  // 驻 No.12
];

/**
 * 排序函数
 * 根据配置文件中的顺序对图片进行排序
 */
export function sortPhotosByCustomOrder<T extends { id: string }>(photos: T[]): T[] {
  const orderMap = new Map<string, number>();

  // 为每个ID分配一个排序值
  CUSTOM_PHOTO_ORDER.forEach((id, index) => {
    orderMap.set(id, index);
  });

  // 排序：在配置中的图片按配置顺序，不在配置中的按原顺序排在后面
  return [...photos].sort((a, b) => {
    const aIndex = orderMap.has(a.id) ? orderMap.get(a.id)! : Number.MAX_SAFE_INTEGER;
    const bIndex = orderMap.has(b.id) ? orderMap.get(b.id)! : Number.MAX_SAFE_INTEGER;

    // 如果都在配置中，按配置顺序
    if (aIndex !== Number.MAX_SAFE_INTEGER && bIndex !== Number.MAX_SAFE_INTEGER) {
      return aIndex - bIndex;
    }

    // 如果只有一个在配置中，配置中的排在前面
    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }

    // 如果都不在配置中，保持原顺序
    return 0;
  });
}
