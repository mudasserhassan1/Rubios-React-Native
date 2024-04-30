interface BillingBalance {


    balance: number,
    //Gift card balance

    success: boolean,
    // Whether or not gift card balance was retrieved.

    message?: string
    // Validation message. Gives detail on why a balance inquiry may have failed.

}
