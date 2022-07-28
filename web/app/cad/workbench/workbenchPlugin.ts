import {ApplicationContext} from "context";
import {WorkbenchService} from "cad/workbench/workbenchService";
import {CurrentWorkbenchIcon} from "cad/workbench/CurrentWorkbenchIcon";


declare module 'context' {
  interface ApplicationContext {

    workbenchService: WorkbenchService;
  }
}


export const WorkbenchPlugin = {

  activate(ctx: ApplicationContext) {

    ctx.workbenchService = new WorkbenchService(ctx);

    ctx.services.menu.registerMenus([
      {
        id: 'workbenches',
        label: 'workbenches',
        icon: CurrentWorkbenchIcon,

        info: 'switch workbench',
        actions: () => {
          const workbenches = ctx.workbenchService.workbenches$.value;
          return Object.keys(workbenches).filter(w => w !== 'sketcher').map(w => 'workbench.switch.' + workbenches[w].workbenchId)
        }
      }
    ]);
  }

}
