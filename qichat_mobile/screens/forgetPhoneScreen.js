import { useState } from "react"
import EnterPhoneScreen from "./enterPhoneScreen"
import VerificationPhone from "./verificationPhoneScreen"
import UpdatingPassword from "./updatingPasswordScreen"
import { View } from "react-native"

export const steps = {
    ENTERINGPHONE: 'a',
    VERIFICATIONPHONE: 'b',
    UPDATINGPASSWORD: 'c'
}

const ForGotPassWord = () => {
    const [currentStep, setCurrentStep] = useState(steps.ENTERINGPHONE)
    const [user, setUser] = useState()

    return (
        <View style={{ height: '100%', width: '100%' }} >
            {currentStep === steps.ENTERINGPHONE ?
                <EnterPhoneScreen setCurrentStep={setCurrentStep} user={user} setUser={setUser} />
                :
                currentStep === steps.VERIFICATIONPHONE ?
                    <VerificationPhone setCurrentStep={setCurrentStep} user={user} setUser={setUser} />
                    :
                    <UpdatingPassword setCurrentStep={setCurrentStep} user={user} setUser={setUser} />
            }
        </View>
    )
}

export default ForGotPassWord