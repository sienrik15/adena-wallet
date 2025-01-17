import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import TitleWithDesc from '@components/title-with-desc';
import SeedBox from '@components/seed-box';
import TermsCheckbox from '@components/terms-checkbox';
import Button, { ButtonHierarchy } from '@components/buttons/button';
import Text from '@components/text';
import { useLocation, useNavigate } from 'react-router-dom';
import { RoutePath } from '@router/path';
import { makeCosmoshubPath, Wallet } from 'adena-module';
import SeedViewAndCopy from '@components/buttons/seed-view-and-copy';
import { useLoadAccounts } from '@hooks/use-load-accounts';
import { useAdenaContext } from '@hooks/use-context';
import { useRecoilState } from 'recoil';
import { WalletState } from '@states/index';

const text = {
  title: 'Seed Phrase',
  desc: 'This phrase is the only way to recover this wallet. DO NOT share it with anyone.',
  termsA: 'This phrase will only be stored on this device. Adena can’t recover it for you.',
  termsB: 'I have saved my seed phrase.',
  blurScreenText: 'Make sure no one is watching your screen',
};

export const YourSeedPhrase = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { walletService, accountService } = useAdenaContext();
  const [terms, setTerms] = useState(false);
  const [seeds, setSeeds] = useState(() => Wallet.generateMnemonic());
  const [viewSeedAgree, setViewSeedAgree] = useState(false);
  const [showBlurScreen, setShowBlurScreen] = useState(true);
  const [clicked, setClicked] = useState(false);
  const { loadAccounts } = useLoadAccounts();
  const [, setState] = useRecoilState(WalletState.state);

  const handleTermsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setTerms((prev: boolean) => !prev),
    [terms],
  );

  const handleNextButtonClick = async () => {
    if (clicked) {
      return;
    }
    setClicked(true);
    if (isAddAccount()) {
      addAccount();
      return;
    }

    setClicked(false);
    navigate(RoutePath.CreatePassword, {
      state: {
        type: 'SEED',
        seeds,
      },
    });
  }

  const isAddAccount = () => {
    return location?.state?.type === "ADD_ACCOUNT";
  };

  const addAccount = async () => {
    const password = await walletService.getRawPassword();
    const createdWallet = await walletService.createWallet({ mnemonic: seeds, password });
    await createdWallet.initAccounts();

    const account = createdWallet.getAccounts()[0];
    const accountIndex = await accountService.getLastAccountIndex();
    account.setIndex(accountIndex + 1);
    account.setAccountType("SEED");
    account.setSigner(createdWallet);
    await accountService.addAccount(account);
    await accountService.updateCurrentAccount(account);
    loadAccounts();
    navigate(RoutePath.Wallet);
  }

  const viewSeedAgreeButton = () => {
    if (terms) setViewSeedAgree(true);
    setShowBlurScreen(false);
    setTerms(false);
  };

  return (
    <Wrapper>
      <TitleWithDesc title={text.title} desc={text.desc} isWarningDesc />
      <SeedBox
        seeds={seeds.split(' ')}
        scroll={false}
        hasBlurScreen={showBlurScreen}
        hasBlurText={!viewSeedAgree}
        blurScreenText={text.blurScreenText}
        className='seed-box'
      />
      {viewSeedAgree && (
        <SeedViewAndCopy
          showBlurScreen={showBlurScreen}
          setShowBlurScreen={setShowBlurScreen}
          copyStr={seeds}
          toggleText='Seed Phrase'
        />
      )}
      <TermsWrap>
        <TermsCheckbox
          checked={terms}
          onChange={handleTermsChange}
          tabIndex={1}
          id={viewSeedAgree ? 'terms-B' : 'terms-A'}
          text={viewSeedAgree ? text.termsB : text.termsA}
          checkboxPos={viewSeedAgree ? 'CENTER' : 'TOP'}
        />
        <Button
          fullWidth
          hierarchy={ButtonHierarchy.Primary}
          disabled={!terms}
          onClick={viewSeedAgree ? handleNextButtonClick : viewSeedAgreeButton}
          tabIndex={2}
        >
          <Text type='body1Bold'>{viewSeedAgree ? 'Next' : 'Reveal Seed Phrase'}</Text>
        </Button>
      </TermsWrap>
    </Wrapper>
  );
};

const Wrapper = styled.main`
  ${({ theme }) => theme.mixins.flexbox('column', 'center', 'flex-start')};
  width: 100%;
  height: 100%;
  padding-top: 50px;
  .seed-box {
    margin-top: 27px;
  }
`;

const TermsWrap = styled.div`
  margin-top: auto;
  width: 100%;
  .terms-A {
    margin-bottom: 13px;
  }
`;
