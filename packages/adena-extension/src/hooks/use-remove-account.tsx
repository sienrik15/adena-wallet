import { useResetRecoilState } from 'recoil';
import { WalletState } from '@states/index';
import { useAdenaContext } from './use-context';
import { WalletAccount } from 'adena-module';

export const useRemoveAccount = (): {
  availRemoveAccount: () => Promise<boolean>,
  removeAccount: (account: InstanceType<typeof WalletAccount>) => Promise<boolean>,
} => {
  const { accountService } = useAdenaContext();
  const clearCurrentBalance = useResetRecoilState(WalletState.currentBalance);

  const availRemoveAccount = async () => {
    const accounts = await accountService.getAccounts();
    return accounts.length > 1;
  };

  const removeAccount = async () => {
    const currentAccount = await accountService.getCurrentAccount();
    await accountService.deleteAccount(currentAccount);
    clearCurrentBalance();
    return true;
  };

  return { availRemoveAccount, removeAccount };
};
