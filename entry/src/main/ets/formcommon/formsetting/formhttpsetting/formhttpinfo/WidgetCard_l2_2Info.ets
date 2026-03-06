import { FormHttpInfo } from '../../../utils/httputils/FormHttpInfo';
/**
 * FormHttpInfo.url is used to get the data for form update. You need to configure the url, it is necessary to
 * replace with the actual url. And http option is optional.
 *
 * # Examples
 *
 * ```
 * const widgetCard_l2_2HttpInfo = new FormHttpInfo(
 *   'widgetCard_l2_21',
 *   new Map([['title', 'string'], ['image', 'Resource'], ['ratingNum', 'number']]),
 *   'url_to_be_replaced',
 *   {
 *     connectTimeout: 1000,
 *     readTimeout: 1000
 *   }
 * );
 * ```
 */

export const widgetCard_l2_2HttpInfo = new FormHttpInfo(
  'widgetCard_l2_2',
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
['digitTitleFText2', 'string'],]),
  'url_to_be_replaced'
);