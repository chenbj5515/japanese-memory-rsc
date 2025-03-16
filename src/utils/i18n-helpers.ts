/**
 * 用于处理多语言内容的工具函数
 * 这个函数接收一个t函数和原始的mock数据，返回根据当前语言本地化后的数据
 * 
 * @param t 翻译函数，来自useTranslations
 * @param mockData 原始mock数据
 * @returns 本地化后的mock数据
 */
export function getLocalizedMockData(t: any, mockData: any) {
  // 深拷贝原始数据，避免修改原始对象
  const localizedData = JSON.parse(JSON.stringify(mockData));

  // 处理studyItems数组中的每一项
  if (localizedData.studyItems && Array.isArray(localizedData.studyItems)) {
    localizedData.studyItems = localizedData.studyItems.map((item: any, index: number) => {
      // 使用t函数获取本地化的问题文本
      item.question = t(`studyItems.item${index}.question`);
      
      // 处理memo_card中的translation
      if (item.memo_card) {
        item.memo_card.translation = t(`studyItems.item${index}.translation`);
      }
      
      return item;
    });
  }

  return localizedData;
} 