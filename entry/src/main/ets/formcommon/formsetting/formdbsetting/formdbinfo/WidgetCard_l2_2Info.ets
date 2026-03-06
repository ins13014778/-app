import { FormDbInfo } from '../../../utils/dbutils/FormDbInfo';

/**
 * At present, there is no data in the database, so updating form has no effect, You can imitate the following examples
 * to insert the data required for form updating into the database.
 *
 * # Examples
 *
 * ```
 * const formDBInfo = new FormDbInfo(
 *   'widgetCard_l2_21',
 *   'widgetCard_l2_21Table',
 *   new Map([['title', 'string'], ['image', 'Resource'], ['ratingNum', 'number']]),
 *   [
 *     new Map([['title', '数码家电直播'], ['image', JSON.stringify($r('app.media.image1'))], ['ratingNum', '4']]),
 *     new Map([['title', '食品服装直播'], ['image', JSON.stringify($r('app.media.image2'))], ['ratingNum', '4.5']])
 *   ]
 * );
 * ```
 */

export const widgetCard_l2_2DbInfo = new FormDbInfo(
  'widgetCard_l2_2',
  'widgetCard_l2_2Table',
  new Map([
['category2', 'string'],
['textSubTitleG1', 'string'],
['category3', 'string'],
['category1', 'string'],
['categoryImg3', 'Resource'],
['categoryImg1', 'Resource'],
['locationIcon', 'Resource'],
['weatherIcon_current', 'Resource'],
['categoryImg2', 'Resource'],
['backgroundImg', 'Resource'],
['cityName', 'string'],
['recommend1', 'string'],
['recommend2', 'string'],
['recommend3', 'string'],
['digitTitleFText1', 'string'],
['textSubTitleG2', 'string'],
['digitTitleFText2', 'string'],
  ])
);