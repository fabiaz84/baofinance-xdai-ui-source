import BigNumber from 'bignumber.js'
import { useCallback, useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import {
  getBaoContract,
  getxBaoStakingContract
} from '../bao/utils'
import { getAllowance } from '../utils/erc20'
import usePanda from './useBao'



const useAllowanceStaking = () => {
  const [allowance, setAllowance] = useState(new BigNumber(0))
  const { account }: { account: string; ethereum: provider } = useWallet()
  const bao = usePanda()
  const baoContract = getBaoContract(bao)
  const stakingContract = getxBaoStakingContract(bao)

  const fetchAllowance = useCallback(async () => {
    const allowance = await getAllowance(
      baoContract,
      account,
      stakingContract.options.address,
    )
    setAllowance(new BigNumber(allowance))
  }, [account, stakingContract, baoContract])

  useEffect(() => {
    if (account && stakingContract && baoContract) {
      fetchAllowance()
    }
    const refreshInterval = setInterval(fetchAllowance, 5000)
    return () => clearInterval(refreshInterval)
  }, [account, stakingContract, baoContract])

  return allowance
}

export default useAllowanceStaking
