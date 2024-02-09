'use client';

import { useChain } from '@cosmos-kit/react';
import { useNotifiClientContext } from '@notifi-network/notifi-react-card';
import localforage from 'localforage';

export default function NotifiDashboard() {
  const { disconnect, isWalletConnected } = useChain('injective');
  const {
    frontendClientStatus: { isAuthenticated },
  } = useNotifiClientContext();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      Dummy Dashboard {JSON.stringify({ isAuthenticated })}
      <button
        onClick={async () => {
          localforage
            .getItem(
              'notifi-jwt:dev:junitest.xyz:INJECTIVE:inj1phmamfj6rsh7kuvwn80psm7n77qc3phk0fjtjg:AwhaIqjI0+NSULEux9CHEVpJ/Spth0CI382uQw2nKI3Q:authorization',
            )
            .then((res) => console.log('1', { res }));
        }}
      >
        get
      </button>
      <button
        onClick={async () => {
          const newValue = {
            expiry: '2023-12-15T08:15:39.170Z',
            token:
              'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwidHlwIjoiSldUIiwiY3R5IjoiSldUIn0..vOfww5LCrtKa2oNONIfRwQ.kqhZLcD0m-HhnZTju9smGHigof6oRPnrHJ4gJN2gY2PRaUb8aXcoDzNF8ndnIwNnUgekKA3fBABnvW0xBAsLkpmVIzkQpPEYhjEGywzJOfBF8VVFhf0nx9h_-WJP0dn6LcjHeq8wfiTPnnwzQ3t3onWWanDYEreYFNKjev7PmjhTM-jVkqw__PgxjDYjDbrcwM2bHymK03CZ5Ffbt2wCG2SSXGOoExg7iRYzoh02s7EtXtmu4Bceh3LH5CFjf6Ha8TaakVs1XyXPISpZKLnSkNXxekNvGJ-8GRrzgXYhTr6vHIciE-LACq0g1xIgcjkYBcBewjI1kACFqpSyUmDX1VGkIyEWVbboCmsUo7eYeo-btfz_dUV2dVFzSSCRLl0p6bLHpWPxrVoHvv5KF2Nky5FkzEzjzVA4ZJmaLR9qMNr0-_ub58apcW2LM4sRXUnyjfD3_rp95cAVuDmTv64uuBw3-iTMZdQvN7sMAvS0sxCxxYzimhhNOyiBsK4pF4-QY9opY2lQ9Ce6wU-o0JeBRNdgYqwsrWdiL6jDAXtW39OIxs3v5kDGvX8G3wjDWUoCJL0s8Cevi8MIshHMiMVRZLhffdKWUge09x3s1xrEo4ugQ6U9i7vwv_raoW7M8Rs6m_Z6OOG4B90-njTMj_8sZKvHWhMxIzxV9ABRWPMNTCv4oEWCOUtFN_ggZWRvGsfC63nG_6LAA9hI0iVEuS7MJLXsI0Yq7eck9SPve1c3LLR7dlddeBNKm78Nvy2diIVup0VzltgRlcVYu12ioR_GyrXux40gaKnm4McNdPdo51u1W2vAbQOyP1bn2dRrp9isbi3xJ4ablZ-Q7St-5sVPww4pMLBlC-u8DEcDMJXuBOzmjwj4jPAHtPN0D38ElUAERuXbUoYNkMV6KNoM7TRv7g.uygptp7IFvCVVtBdxZW7URZtRMBQAUkiEkmRgTHwtnU',
          };
          localforage
            .setItem(
              'notifi-jwt:dev:junitest.xyz:INJECTIVE:inj1phmamfj6rsh7kuvwn80psm7n77qc3phk0fjtjg:AwhaIqjI0+NSULEux9CHEVpJ/Spth0CI382uQw2nKI3Q:authorization',
              newValue,
            )
            .then((res) => console.log('1', { res }));
        }}
      >
        set
      </button>
      {isWalletConnected ? (
        // NOTE: This hidden button is just FYI in case disconnect is needed during development
        <button
          className="bg-red-100 p-5 rounded"
          onClick={() => {
            if (!disconnect) return console.log('no disconnect');
            disconnect();
          }}
        >
          disconnect wallet
        </button>
      ) : null}
    </div>
  );
}
