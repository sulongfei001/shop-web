import Strings from "../utils/Strings";
class OrganizationContext {
    static get() {
        let organizationContext = {};
        organizationContext.organizationId = sessionStorage.getItem('organizationContext.organizationId');
        organizationContext.activityCategoryId = sessionStorage.getItem('organizationContext.activityCategoryId');

        organizationContext.organizationId = Strings.defaultIfEmpty(organizationContext.organizationId, undefined);
        organizationContext.activityCategoryId = Strings.defaultIfEmpty(organizationContext.activityCategoryId, undefined);
        return organizationContext;
    }

    static set(organizationContext) {
        if (organizationContext.organizationId) {
            sessionStorage.setItem('organizationContext.organizationId', organizationContext.organizationId);
        }
        if (organizationContext.activityCategoryId) {
            sessionStorage.setItem('organizationContext.activityCategoryId', organizationContext.activityCategoryId);
        }

        // if(organizationContext.organizationId){
        //     sessionStorage.setItem('organizationContext.organizationId',organizationContext.organizationId);
        //  }else {
        //     sessionStorage.removeItem('organizationContext.organizationId');
        // }
    }

    static remove() {
        sessionStorage.removeItem('organizationContext.organizationId');
        sessionStorage.removeItem('organizationContext.activityCategoryId');
    }
}

export default OrganizationContext;