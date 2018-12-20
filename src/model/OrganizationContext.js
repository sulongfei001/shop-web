import Strings from "../utils/Strings";
class OrganizationContext {
    static get() {
        let organizationContext = {};
        organizationContext.organizationId = sessionStorage.getItem('organizationContext.organizationId');
        OrganizationContext.typeId = sessionStorage.getItem('organizationContext.typeId');

        organizationContext.organizationId = Strings.defaultIfEmpty(organizationContext.organizationId, undefined);
        organizationContext.typeId = Strings.defaultIfEmpty(organizationContext.typeId, undefined);
        return organizationContext;
    }

    static set(organizationContext) {
        if (organizationContext.organizationId) {
            sessionStorage.setItem('organizationContext.organizationId', organizationContext.organizationId);
        }
        if (organizationContext.typeId) {
            sessionStorage.setItem('organizationContext.typeId', organizationContext.typeId);
        }

        // if(organizationContext.organizationId){
        //     sessionStorage.setItem('organizationContext.organizationId',organizationContext.organizationId);
        //  }else {
        //     sessionStorage.removeItem('organizationContext.organizationId');
        // }
    }

    static remove() {
        sessionStorage.removeItem('organizationContext.organizationId');
        sessionStorage.removeItem('organizationContext.typeId');
    }
}

export default OrganizationContext;