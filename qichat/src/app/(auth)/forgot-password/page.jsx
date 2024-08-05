'use client'
import EnteringPhone from '@/components/forgor-password/enteringPhone';
import UpdatingPassword from '@/components/forgor-password/updatingPassword';
import VerificationPhone from '@/components/forgor-password/verificationPhone';
import React, { useContext, useEffect, useState } from 'react';

export const steps = {
    ENTERINGPHONE: 'a',
    VERIFICATIONPHONE: 'b',
    UPDATINGPASSWORD: 'c'
}

const ForGotPassWord = () => {
    const [currentStep, setCurrentStep] = useState(steps.ENTERINGPHONE)
    const [user, setUser] = useState()

    return (
        <section className='w-[100%]' >
            {currentStep === steps.ENTERINGPHONE ?
                <EnteringPhone setCurrentStep={setCurrentStep} user={user} setUser={setUser} />
                :
                currentStep === steps.VERIFICATIONPHONE ?
                    <VerificationPhone setCurrentStep={setCurrentStep} user={user} setUser={setUser} />
                    :
                    <UpdatingPassword setCurrentStep={setCurrentStep} user={user} setUser={setUser} />
            }
        </section>
    )
}

export default ForGotPassWord