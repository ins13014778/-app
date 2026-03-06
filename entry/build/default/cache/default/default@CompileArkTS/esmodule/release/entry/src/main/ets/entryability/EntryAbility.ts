import { createDbInsertData } from "@normalized:N&&&entry/src/main/ets/formcommon/DbIndex&";
import { actionCreate, actionNewWant, actionWindowStageCreate } from "@normalized:N&&&entry/src/main/ets/formcommon/formsetting/FormAction&";
import type AbilityConstant from "@ohos:app.ability.AbilityConstant";
import ConfigurationConstant from "@ohos:app.ability.ConfigurationConstant";
import UIAbility from "@ohos:app.ability.UIAbility";
import type Want from "@ohos:app.ability.Want";
import hilog from "@ohos:hilog";
import type window from "@ohos:window";
const DOMAIN = 0x0000;
export default class EntryAbility extends UIAbility {
    onNewWant(want: Want, launchParam: AbilityConstant.LaunchParam) {
        /**
         * This is the automatically generated code for the logic of card interactions.
         * Used to card action.
         */
        actionNewWant(want, this);
    }
    onCreate(want: Want, launchParam: AbilityConstant.LaunchParam): void {
        /**
         * This is the automatically generated code for the logic of card interactions.
         * Used to card action.
         */
        actionCreate(want);
        /**
         * This is the automatically generated code for the logic of card interactions.
         * Used to create a database and insert update card data.
         */
        createDbInsertData(this.context);
        try {
            this.context.getApplicationContext().setColorMode(ConfigurationConstant.ColorMode.COLOR_MODE_NOT_SET);
        }
        catch (err) {
            hilog.error(DOMAIN, 'testTag', 'Failed to set colorMode. Cause: %{public}s', JSON.stringify(err));
        }
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onCreate');
    }
    onDestroy(): void {
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onDestroy');
    }
    onWindowStageCreate(windowStage: window.WindowStage): void {
        /**
         * This is the automatically generated code for the logic of card interactions.
         * Used to card action.
         */
        actionWindowStageCreate(windowStage);
        // Main window is created, set main page for this ability
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onWindowStageCreate');
        windowStage.loadContent('pages/SplashScreen', (err) => {
            if (err.code) {
                hilog.error(DOMAIN, 'testTag', 'Failed to load the content. Cause: %{public}s', JSON.stringify(err));
                return;
            }
            hilog.info(DOMAIN, 'testTag', 'Succeeded in loading the content.');
        });
    }
    onWindowStageDestroy(): void {
        // Main window is destroyed, release UI related resources
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onWindowStageDestroy');
    }
    onForeground(): void {
        // Ability has brought to foreground
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onForeground');
    }
    onBackground(): void {
        // Ability has back to background
        hilog.info(DOMAIN, 'testTag', '%{public}s', 'Ability onBackground');
    }
}
