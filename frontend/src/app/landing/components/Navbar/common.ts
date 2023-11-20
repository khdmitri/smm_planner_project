type refresherFunc = (flag: boolean) => void
export interface tokenInput {
    token: string | null,
    setRefreshReCaptcha: refresherFunc
}