import directory from '../shared/providers.json';
import type {Complaint} from './model';
export const providers=directory;
export const categories={billing:{ar:'الفواتير والعدادات',en:'Billing & meters'},outage:{ar:'انقطاع الخدمة',en:'Service interruption'},quality:{ar:'جودة الخدمة',en:'Service quality'},connection:{ar:'التوصيل والشبكة',en:'Connection & network'},other:{ar:'أخرى',en:'Other'}};
export const findings={not_reviewed:{ar:'لم تُقيّم بعد',en:'Not assessed'},substantiated:{ar:'ثبتت المشكلة',en:'Substantiated'},not_substantiated:{ar:'لم تثبت المشكلة',en:'Not substantiated'},inconclusive:{ar:'غير حاسمة',en:'Inconclusive'}};
export function providerName(c:Pick<Complaint,'provider'|'providerId'>,lang:'ar'|'en'){return providers.find(p=>p.id===c.providerId)?.name[lang]||c.provider;}
