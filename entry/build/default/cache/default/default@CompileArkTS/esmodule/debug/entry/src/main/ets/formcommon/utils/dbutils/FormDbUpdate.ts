import type dataPreferences from "@ohos:data.preferences";
import dataRdb from "@ohos:data.relationalStore";
import type { FormDbInfo } from './FormDbInfo';
import formBindingData from "@ohos:app.form.formBindingData";
import formProvider from "@ohos:app.form.formProvider";
import { STORE_CONFIG } from "@normalized:N&&&entry/src/main/ets/formcommon/utils/dbutils/RdbUtils&";
import FormPreference from "@normalized:N&&&entry/src/main/ets/formcommon/utils/FormPreference&";
import { configUpdateCondition, getDataFromDb } from "@normalized:N&&&entry/src/main/ets/formcommon/formsetting/formdbsetting/UserSettings&";
import { formDbInfoArray } from "@normalized:N&&&entry/src/main/ets/formcommon/formsetting/formdbsetting/formdbinfo/Index&";
/**
 * update form using Db
 */
export class FormDbUpdate {
    /**
     * scheduledUpdateTime or updateDuration update form using db
     * @param formId
     * @param context
     */
    static updateForm(formId: string, context: Context) {
        let promise: Promise<dataPreferences.Preferences> = FormPreference.getPersistentForm(context);
        promise.then(async (storeDB: dataPreferences.Preferences) => {
            console.info("Succeeded to get preferences.");
            let valueType = await storeDB.get(formId, 'undefined');
            let formName = valueType.toString();
            let promise = dataRdb.getRdbStore(context, STORE_CONFIG);
            promise.then(async (rdbStore) => {
                formDbInfoArray.forEach((formDbInfo) => {
                    FormDbUpdate.updateFormOfOne(formName, formId, rdbStore, formDbInfo);
                });
            });
        });
    }
    /**
     * event update form using db
     * @param formId
     * @param message
     * @param context
     */
    static formEvent(formId: string, message: string, context: Context) {
        let promise: Promise<dataPreferences.Preferences> = FormPreference.getPersistentForm(context);
        promise.then(async (storeDB: dataPreferences.Preferences) => {
            console.info("Succeeded to get preferences.");
            let valueType = await storeDB.get(formId, 'undefined');
            let formName = valueType.toString();
            if (!configUpdateCondition(message, formName)) {
                return;
            }
            let promise = dataRdb.getRdbStore(context, STORE_CONFIG);
            promise.then(async (rdbStore) => {
                formDbInfoArray.forEach((formDbInfo) => {
                    FormDbUpdate.updateFormOfOne(formName, formId, rdbStore, formDbInfo);
                });
            });
        });
    }
    /**
     * update form by formId
     * @param formName
     * @param formId
     * @param rdbStore
     * @param formDbInfo
     */
    static updateFormOfOne(formName: string, formId: string, rdbStore: dataRdb.RdbStore, formDbInfo: FormDbInfo) {
        if (formName === formDbInfo.formName) {
            let predicates = new dataRdb.RdbPredicates(formDbInfo.tableName);
            rdbStore.query(predicates).then(resSet => {
                let obj = getDataFromDb(resSet, formDbInfo);
                let formData = formBindingData.createFormBindingData(obj);
                formProvider.updateForm(formId, formData);
            });
        }
    }
}
