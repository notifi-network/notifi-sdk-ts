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
    <div className="flex flex-col gap-4 bg-white px-10 py-6 md:p-10 w-11/12 md:max-w-[33.37rem] rounded-3xl">
      <div className="flex items-center w-48 gap-3">
        <Image
          src="/logos/injective-notifi-logo.png"
          width={195}
          height={44}
          alt="Injective"
          unoptimized={true}
        />
      </div>

      <div className="md:text-5xl text-3xl font-semibold">
        Injective{' '}
        <span className="text-notifi-primary-text">notifications</span>
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
