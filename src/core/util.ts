
/**
 * 根据最小值和最大值取得该范围内的随机数（无法取得最大值）
 * @param min 
 * @param max 
 */
export function getRandom(min: number, max: number) {
    const dec = max - min;
    return Math.floor(Math.random() * dec + min);
}