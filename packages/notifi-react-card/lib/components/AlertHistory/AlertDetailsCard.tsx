import clsx from 'clsx';
import * as DOMPurify from 'dompurify';
import { marked } from 'marked';
import { getAlertDetailsContents } from 'notifi-react-card/lib/utils';
import React, { useMemo } from 'react';

import { formatAlertDetailsTimestamp } from '../../utils/AlertHistoryUtils';
import { NotificationHistoryEntry } from '../subscription';

export type AlertDetailsProps = Readonly<{
  notificationEntry: NotificationHistoryEntry;
  classNames?: Readonly<{
    detailsContainer?: string;
    BackArrowIcon?: string;
  }>;
}>;
export const AlertDetailsCard: React.FC<AlertDetailsProps> = ({
  notificationEntry,
  classNames,
}) => {
  const { bottomContent, otherContent, topContent, bottomContentHtml } =
    useMemo(
      () => getAlertDetailsContents(notificationEntry),
      [notificationEntry],
    );

  const { sanitizedMarkdownBottomContent, sanitizedBottomContentHtml } =
    useMemo(() => {
      let sanitizedMarkdownBottomContent = bottomContent;
      try {
        const parsedMarkdown = marked.parse(bottomContent);
        sanitizedMarkdownBottomContent = DOMPurify.sanitize(parsedMarkdown);
      } catch (e) {
        console.error('Error parsing markdown: ', e);
      }
      const sanitizedBottomContentHtml =
        bottomContentHtml && DOMPurify.sanitize(bottomContentHtml);
      return { sanitizedMarkdownBottomContent, sanitizedBottomContentHtml };
    }, [bottomContent, bottomContentHtml]);

  return (
    <div
      className={clsx(
        'NotifiAlertDetails__container',
        classNames?.detailsContainer,
      )}
    >
      <div className={clsx('NotifiAlertDetails__topContentContainer')}>
        <div className={clsx('NotifiAlertDetails__topContent')}>
          {topContent}
        </div>
        <div className={clsx('NotifiAlertDetails__timestamp')}>
          {formatAlertDetailsTimestamp(notificationEntry.createdDate)}
        </div>
      </div>
      <div className={clsx('NotifiAlertDetails__bottomContent')}>
        {sanitizedBottomContentHtml ? (
          // If `messageHtml` exists just use it, otherwise use `message` (which is plain text)
          <div
            dangerouslySetInnerHTML={{ __html: sanitizedBottomContentHtml }}
          />
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: sanitizedMarkdownBottomContent }}
          />
        )}
        <div>{otherContent}</div>
      </div>
    </div>
  );
};
