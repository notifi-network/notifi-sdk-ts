import Image from 'next/image';

export type EcosystemHeroProps = {
  isLoading: boolean;
  cta?: () => void;
  ctaButtonText: string;
};

export const EcosystemHero: React.FC<EcosystemHeroProps> = ({
  isLoading,
  cta,
  ctaButtonText,
}) => {
  return (
    <div className="flex flex-col gap-4 bg-white p-10 max-w-[33.37rem] rounded-3xl">
      <div className="flex items-center w-48 gap-3">
        <Image
          src="/logos/injective.png"
          width={95}
          height={15}
          alt="Injective"
          unoptimized={true}
        />
        <div className="text-gray-400">x</div>
        <div className="flex w-16 justify-between">
          <Image
            src="/logos/notifi.svg"
            width={15}
            height={15}
            alt="Injective"
            unoptimized={true}
          />
          <Image
            src="/logos/notifi-text.svg"
            width={40}
            height={15}
            alt="Injective"
            unoptimized={true}
          />
        </div>
      </div>

      <div className="text-5xl font-semibold">
        Injective Ecosystem{' '}
        <span className="text-notifi-primary-text">alerts</span>
      </div>

      <div className="text-gray-500 ">
        Build and use best-in-class applications on the network shaping the
        future.
      </div>

      <button className=" bg-notifi-button-primary-blueish-bg w-52 h-11 cursor-pointer rounded-lg text-white">
        {isLoading ? (
          <div className="m-auto h-5 w-5 animate-spin rounded-full  border-2 border-white border-b-transparent border-l-transparent"></div>
        ) : (
          <div onClick={() => cta?.()}>{ctaButtonText}</div>
        )}
      </button>
    </div>
  );
};
