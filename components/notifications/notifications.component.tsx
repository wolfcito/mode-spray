import { NotificationsProps } from './notifications.type'
import { TabNotification } from './tab-notification.component'

export function Notifications({ notificationList }: NotificationsProps) {
  if (!notificationList)
    return (
      <div className="flex flex-col w-full gap-4">
        <div className="w-full h-16 skeleton"></div>
        <div className="w-full h-16 skeleton"></div>
        <div className="w-full h-16 skeleton"></div>
        <div className="w-full h-16 skeleton"></div>
      </div>
    )

  return (
    <div className="drawer-side">
      <label htmlFor="notification-panel" aria-label="close sidebar" className="drawer-overlay"></label>
      <ul className="!z-10 min-h-full p-4 bg-black menu w-80 text-base-content">
        <div role="tablist" className="pt-20 pb-4 tabs tabs-bordered">
          <input type="radio" name="my_tabs_1" role="tab" className="tab" aria-label="Inbox" defaultChecked />
          <div role="tabpanel" className="py-2 tab-content">
            <TabNotification notificationList={notificationList} />
          </div>
        </div>
      </ul>
    </div>
  )
}
