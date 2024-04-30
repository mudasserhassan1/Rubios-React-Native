import {useSelector} from "react-redux";

const useFirebaseConfigSelector = () => {
    const firebaseConfig = useSelector(state => state.firebaseConfig);
    const {config = {}} = firebaseConfig ?? {};
    const {
        punchh_client_id = '',
        base_url = '',
        api_prefix = '',
        olo_prefix = '',
        punchh_prefix = '',
        ingredient_url = '',
        payment_script = '',
        upsells_config= {},
        contact_us_url = '',
        privacy_policy_url = '',
        faqs_url = '',
        nutrition_page_url = '',
        terms_and_conditions_url = '',
    } = config ?? {};
    return {
        punchh_client_id,
        base_url,
        api_prefix,
        olo_prefix,
        punchh_prefix,
        ingredient_url,
        payment_script,
        upsells_config,
        contact_us_url,
        privacy_policy_url,
        faqs_url,
        nutrition_page_url,
        terms_and_conditions_url
    }
}
 export default useFirebaseConfigSelector;
