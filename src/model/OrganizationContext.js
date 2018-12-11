import Strings from "../utils/Strings";
class OrganizationContext {
    static get(){
        let organizationContext = {};
        organizationContext.organizationId = sessionStorage.getItem('organizationContext.organizationId');

        organizationContext.organizationId = Strings.defaultIfEmpty(organizationContext.organizationId, undefined);
        return organizationContext;
    }

    static set(organizationContext){
        if(organizationContext.organizationId){
            sessionStorage.setItem('organizationContext.organizationId',organizationContext.organizationId);
        }

        // if(organizationContext.organizationId){
        //     sessionStorage.setItem('organizationContext.organizationId',organizationContext.organizationId);
        //  }else {
        //     sessionStorage.removeItem('organizationContext.organizationId');
        // }
    }

    static remove(){
        sessionStorage.removeItem('organizationContext.organizationId');
    }
}

export default OrganizationContext;