export interface InitialData {
  responseContext: InitialDataResponseContext;
  contents: Contents;
  currentVideoEndpoint: CurrentVideoEndpoint;
  trackingParams: string;
  playerOverlays: PlayerOverlays;
  onResponseReceivedEndpoints: OnResponseReceivedEndpoint[];
  engagementPanels: EngagementPanelElement[];
  topbar: Topbar;
  pageVisualEffects: PageVisualEffect[];
  frameworkUpdates: InitialDataFrameworkUpdates;
  microformat?: InitialDataMicroformat;
}

export interface Contents {
  twoColumnWatchNextResults: TwoColumnWatchNextResults;
}

export interface TwoColumnWatchNextResults {
  results: TwoColumnWatchNextResultsResults;
  secondaryResults: TwoColumnWatchNextResultsSecondaryResults;
  autoplay: TwoColumnWatchNextResultsAutoplay;
  conversationBar?: ConversationBar;
}

export interface TwoColumnWatchNextResultsAutoplay {
  autoplay: AutoplayAutoplay;
}

export interface AutoplayAutoplay {
  sets: Set[];
  countDownSecs: number;
  trackingParams: string;
}

export interface Set {
  mode: string;
  autoplayVideo: NavigationEndpointElement;
}

export interface NavigationEndpointElement {
  clickTrackingParams: string;
  commandMetadata: AutoplayVideoCommandMetadata;
  watchEndpoint: AutoplayVideoWatchEndpoint;
}

export interface AutoplayVideoCommandMetadata {
  webCommandMetadata: PurpleWebCommandMetadata;
}

export interface PurpleWebCommandMetadata {
  url: string;
  webPageType: WebPageType;
  rootVe: number;
}

export type WebPageType =
  | "WEB_PAGE_TYPE_WATCH"
  | "WEB_PAGE_TYPE_UNKNOWN"
  | "WEB_PAGE_TYPE_SEARCH"
  | "WEB_PAGE_TYPE_BROWSE"
  | "WEB_PAGE_TYPE_CHANNEL";

export interface AutoplayVideoWatchEndpoint {
  videoId: VideoID;
  params: WatchEndpointParams;
  playerParams: PurplePlayerParams;
  watchEndpointSupportedPrefetchConfig: WatchEndpointSupportedPrefetchConfig;
}

export type WatchEndpointParams = "EAEYAdoBBAgBKgA%3D";

export type PurplePlayerParams = "QAFIAQ%3D%3D";

export type VideoID = "l23fRMkBPKo" | "kxT8-C1vmd4" | "hfMWzxCU3ps";

export interface WatchEndpointSupportedPrefetchConfig {
  prefetchHintConfig: PrefetchHintConfig;
}

export interface PrefetchHintConfig {
  prefetchPriority: number;
  countdownUiRelativeSecondsPrefetchCondition: number;
}

export interface ConversationBar {
  liveChatRenderer?: LiveChatRenderer;
  conversationBarRenderer?: ConversationBarRenderer;
}

export interface ConversationBarRenderer {
  availabilityMessage: AvailabilityMessage;
}

export interface AvailabilityMessage {
  messageRenderer: MessageRenderer;
}

export interface MessageRenderer {
  text: Subtitle;
  trackingParams: string;
}

export interface Subtitle {
  runs: SubtitleRun[];
}

export interface SubtitleRun {
  text: string;
}

export interface LiveChatRenderer {
  continuations: Continuation[];
  header: LiveChatRendererHeader;
  trackingParams: string;
  clientMessages: ClientMessages;
  initialDisplayState: string;
  showButton: ShowButtonClass;
}

export interface ClientMessages {
  reconnectMessage: Subtitle;
  unableToReconnectMessage: Subtitle;
  fatalError: Subtitle;
  reconnectedMessage: Subtitle;
  genericError: Subtitle;
}

export interface Continuation {
  reloadContinuationData: ReloadContinuationData;
}

export interface ReloadContinuationData {
  continuation: string;
  clickTrackingParams: string;
}

export interface LiveChatRendererHeader {
  liveChatHeaderRenderer: LiveChatHeaderRenderer;
}

export interface LiveChatHeaderRenderer {
  overflowMenu: OverflowMenu;
  collapseButton: CancelButton;
  viewSelector: ViewSelector;
}

export interface CancelButton {
  buttonRenderer: InformationButtonButtonRenderer;
}

export interface InformationButtonButtonRenderer {
  style?: PurpleStyle;
  size?: DownloadButtonRendererSize;
  isDisabled?: boolean;
  icon?: Icon;
  accessibility?: AccessibilityData;
  trackingParams: string;
  command?: PurpleCommand;
  accessibilityData?: DisabledAccessibilityData;
  targetId?: string;
  text?: ViewsClass;
  navigationEndpoint?: PurpleNavigationEndpoint;
  loggingDirectives?: ButtonRendererLoggingDirectives;
}

export interface AccessibilityData {
  label: string;
}

export interface DisabledAccessibilityData {
  accessibilityData: AccessibilityData;
}

export interface PurpleCommand {
  clickTrackingParams: string;
  commandMetadata?: ContinuationEndpointCommandMetadata;
  signalServiceEndpoint?: CommandSignalServiceEndpoint;
  openPopupAction?: OnClickCommandOpenPopupAction;
  commandExecutorCommand?: PurpleCommandExecutorCommand;
  hideEngagementPanelEndpoint?: InnertubeCommandHideEngagementPanelEndpoint;
  changeEngagementPanelVisibilityAction?: ChangeEngagementPanelVisibilityAction;
  getSurveyCommand?: GetSurveyCommand;
}

export interface ChangeEngagementPanelVisibilityAction {
  targetId: PanelIdentifier;
  visibility: VisibilityEnum;
}

export type PanelIdentifier =
  | "engagement-panel-clip-create"
  | "PAyouchat"
  | "engagement-panel-structured-description"
  | "shopping_panel_for_entry_point_5"
  | "engagement-panel-searchable-transcript"
  | "engagement-panel-clip-view"
  | "engagement-panel-error-corrections"
  | "engagement-panel-ads"
  | "engagement-panel-comments-section"
  | "PAsearch_preview";

export type VisibilityEnum =
  | "ENGAGEMENT_PANEL_VISIBILITY_EXPANDED"
  | "ENGAGEMENT_PANEL_VISIBILITY_HIDDEN"
  | "ENGAGEMENT_PANEL_VISIBILITY_COLLAPSED";

export interface PurpleCommandExecutorCommand {
  commands: FluffyCommand[];
}

export interface FluffyCommand {
  clickTrackingParams: string;
  changeEngagementPanelVisibilityAction?: ChangeEngagementPanelVisibilityAction;
  updateToggleButtonStateCommand?: UpdateToggleButtonStateCommand;
  hideEngagementPanelEndpoint?: OnTapShowEngagementPanelEndpoint;
  updateTimedMarkersSyncObserverCommand?: UpdateTimedMarkersSyncObserverCommand;
}

export interface OnTapShowEngagementPanelEndpoint {
  identifier: GutParams;
}

export interface GutParams {
  tag: string;
}

export interface UpdateTimedMarkersSyncObserverCommand {
  isEnabled: boolean;
  timedSyncEntityKey: string;
  panelSyncEntityKey: string;
}

export interface UpdateToggleButtonStateCommand {
  toggled: boolean;
  buttonId: string;
}

export interface ContinuationEndpointCommandMetadata {
  webCommandMetadata: FluffyWebCommandMetadata;
}

export interface FluffyWebCommandMetadata {
  sendPost: boolean;
  apiUrl?: PurpleAPIURL;
}

export type PurpleAPIURL =
  | "/youtubei/v1/get_survey"
  | "/youtubei/v1/next"
  | "/youtubei/v1/flag/get_form"
  | "/youtubei/v1/updated_metadata"
  | "/youtubei/v1/pdg/get_pdg_buy_flow"
  | "/youtubei/v1/share/get_share_panel"
  | "/youtubei/v1/like/dislike"
  | "/youtubei/v1/like/removelike"
  | "/youtubei/v1/like/like"
  | "/youtubei/v1/ypc/get_offers"
  | "/youtubei/v1/notification/modify_channel_preference"
  | "/youtubei/v1/subscription/unsubscribe"
  | "/youtubei/v1/subscription/subscribe"
  | "/youtubei/v1/browse/edit_playlist"
  | "/youtubei/v1/playlist/create"
  | "/youtubei/v1/feedback"
  | "/youtubei/v1/backstage/create_post"
  | "/youtubei/v1/get_transcript"
  | "/youtubei/v1/account/set_setting"
  | "/youtubei/v1/notification/get_unseen_count"
  | "/youtubei/v1/account/account_menu"
  | "/youtubei/v1/notification/add_upcoming_event_reminder"
  | "/youtubei/v1/notification/remove_upcoming_event_reminder"
  | "/youtubei/v1/share/get_web_player_share_panel";

export interface GetSurveyCommand {
  endpoint: GetSurveyCommandEndpoint;
  action: string;
}

export interface GetSurveyCommandEndpoint {
  watch: AdsEngagementPanelContentRenderer;
}

export interface AdsEngagementPanelContentRenderer {
  hack: boolean;
}

export interface InnertubeCommandHideEngagementPanelEndpoint {
  panelIdentifier: PanelIdentifier;
}

export interface OnClickCommandOpenPopupAction {
  popup: PurplePopup;
  popupType: PopupType;
}

export interface PurplePopup {
  confirmDialogRenderer: PurpleConfirmDialogRenderer;
}

export interface PurpleConfirmDialogRenderer {
  title: LiveIndicatorText;
  trackingParams: string;
  dialogMessages: LiveIndicatorText[];
  confirmButton: ShowButtonClass;
  cancelButton: ShowButtonClass;
  primaryIsCancel: boolean;
}

export interface ShowButtonClass {
  buttonRenderer: ShowButtonButtonRenderer;
}

export interface ShowButtonButtonRenderer {
  style: StyleTypeEnum;
  size: DownloadButtonRendererSize;
  isDisabled: boolean;
  text: LiveIndicatorText;
  trackingParams: string;
  command?: TentacledCommand;
}

export interface TentacledCommand {
  clickTrackingParams: string;
  commandExecutorCommand?: FluffyCommandExecutorCommand;
  commandMetadata?: AutoplayVideoCommandMetadata;
  urlEndpoint?: CommandURLEndpoint;
}

export interface FluffyCommandExecutorCommand {
  commands: StickyCommand[];
}

export interface StickyCommand {
  clickTrackingParams: string;
  changeEngagementPanelVisibilityAction?: ChangeEngagementPanelVisibilityAction;
  hideEngagementPanelScrimAction?: HideEngagementPanelScrimAction;
  loopCommand?: LoopCommand;
}

export interface HideEngagementPanelScrimAction {
  engagementPanelTargetId: PanelIdentifier;
}

export interface LoopCommand {
  loop: boolean;
}

export interface CommandURLEndpoint {
  url: string;
  target: TargetEnum;
}

export type TargetEnum = "TARGET_NEW_WINDOW";

export type DownloadButtonRendererSize = "SIZE_DEFAULT";

export type StyleTypeEnum =
  | "STYLE_DEFAULT"
  | "STYLE_TEXT"
  | "STYLE_BLUE_TEXT"
  | "STYLE_SUGGESTIVE"
  | "STYLE_PRIMARY";

export interface LiveIndicatorText {
  simpleText: string;
}

export type PopupType = "DIALOG";

export interface CommandSignalServiceEndpoint {
  signal: SignalServiceEndpointSignal;
  actions: PurpleAction[];
}

export interface PurpleAction {
  clickTrackingParams: string;
  signalAction: Signal;
}

export interface Signal {
  signal: string;
}

export type SignalServiceEndpointSignal = "CLIENT_SIGNAL";

export interface Icon {
  iconType: string;
}

export interface ButtonRendererLoggingDirectives {
  trackingParams: string;
  visibility: VisibilityClass;
  attentionLogging: AttentionLogging;
}

export type AttentionLogging = "ATTENTION_LOGGING_SCROLL";

export interface VisibilityClass {
  types: string;
}

export interface PurpleNavigationEndpoint {
  clickTrackingParams: string;
  commandMetadata?: AutoplayVideoCommandMetadata;
  watchEndpoint?: PurpleWatchEndpoint;
  openPopupAction?: InnertubeCommandOpenPopupAction;
}

export interface InnertubeCommandOpenPopupAction {
  popup: FluffyPopup;
  popupType: PopupType;
  accessibilityData: DisabledAccessibilityData;
}

export interface FluffyPopup {
  aboutThisAdRenderer: AboutThisAdRenderer;
}

export interface AboutThisAdRenderer {
  url: URL;
  trackingParams: string;
}

export interface URL {
  privateDoNotAccessOrElseTrustedResourceUrlWrappedValue: string;
}

export interface PurpleWatchEndpoint {
  videoId: string;
  startTimeSeconds?: number;
  watchEndpointSupportedOnesieConfig: WatchEndpointSupportedOnesieConfig;
  playerParams?: string;
  ustreamerConfig?: UstreamerConfig;
}

export type UstreamerConfig = "KgYKBBICZW4=" | "KgkKBxIFZW4tVVM=";

export interface WatchEndpointSupportedOnesieConfig {
  html5PlaybackOnesieConfig: Html5PlaybackOnesieConfig;
}

export interface Html5PlaybackOnesieConfig {
  commonConfig: CommonConfig;
}

export interface CommonConfig {
  url: string;
}

export type PurpleStyle = "STYLE_DEFAULT" | "STYLE_TEXT" | "STYLE_UNKNOWN";

export interface ViewsClass {
  simpleText?: SimpleText;
  runs?: SubtitleRun[];
}

export type SimpleText =
  | "Cancel"
  | "Ask"
  | "1,102,338 views"
  | "2,442 views"
  | "All"
  | "Personalized"
  | "None"
  | "Undo"
  | "Learn more";

export interface OverflowMenu {
  menuRenderer: OverflowMenuMenuRenderer;
}

export interface OverflowMenuMenuRenderer {
  items: PurpleItem[];
  trackingParams: string;
  accessibility: DisabledAccessibilityData;
}

export interface PurpleItem {
  menuServiceItemRenderer?: MenuItemRenderer;
  clientSideToggleMenuItemRenderer?: ClientSideToggleMenuItemRenderer;
  menuNavigationItemRenderer?: MenuItemRenderer;
}

export interface ClientSideToggleMenuItemRenderer {
  defaultText: Subtitle;
  defaultIcon: Icon;
  toggledText: Subtitle;
  toggledIcon: Icon;
  menuItemIdentifier: string;
  command: ClientSideToggleMenuItemRendererCommand;
}

export interface ClientSideToggleMenuItemRendererCommand {
  clickTrackingParams: string;
  toggleLiveChatTimestampsEndpoint: AdsEngagementPanelContentRenderer;
}

export interface MenuItemRenderer {
  text: Subtitle;
  icon: Icon;
  navigationEndpoint?: MenuNavigationItemRendererNavigationEndpoint;
  trackingParams: string;
  serviceEndpoint?: MenuNavigationItemRendererServiceEndpoint;
}

export interface MenuNavigationItemRendererNavigationEndpoint {
  clickTrackingParams: string;
  commandMetadata: PurpleCommandMetadata;
  userFeedbackEndpoint?: UserFeedbackEndpoint;
  showSheetCommand?: NavigationEndpointShowSheetCommand;
}

export interface PurpleCommandMetadata {
  webCommandMetadata?: TentacledWebCommandMetadata;
  interactionLoggingCommandMetadata?: InteractionLoggingCommandMetadata;
}

export interface InteractionLoggingCommandMetadata {
  screenVisualElement: ScreenVisualElement;
}

export interface ScreenVisualElement {
  uiType: number;
}

export interface TentacledWebCommandMetadata {
  ignoreNavigation: boolean;
}

export interface NavigationEndpointShowSheetCommand {
  panelLoadingStrategy: ShowDialogCommandPanelLoadingStrategy;
  contextualSheetPresentationConfig: ContextualSheetPresentationConfig;
}

export interface ContextualSheetPresentationConfig {
  expandToFullWidth: boolean;
}

export interface ShowDialogCommandPanelLoadingStrategy {
  requestTemplate: RequestTemplate;
  screenVe: number;
}

export interface RequestTemplate {
  panelId: PanelID;
  params: string;
}

export type PanelID = "PAadd_to_playlist" | "PApremium_upsell";

export interface UserFeedbackEndpoint {
  hack: boolean;
  bucketIdentifier: string;
}

export interface MenuNavigationItemRendererServiceEndpoint {
  clickTrackingParams: string;
  showLiveChatParticipantsEndpoint?: AdsEngagementPanelContentRenderer;
  popoutLiveChatEndpoint?: CommonConfig;
  commandMetadata?: ContinuationEndpointCommandMetadata;
  playlistEditEndpoint?: ServiceEndpointPlaylistEditEndpoint;
}

export interface ServiceEndpointPlaylistEditEndpoint {
  playlistId: PlaylistID;
  actions: FluffyAction[];
}

export interface FluffyAction {
  addedVideoId: string;
  action: ActionEnum;
}

export type ActionEnum = "ACTION_ADD_VIDEO" | "ACTION_REMOVE_VIDEO_BY_VIDEO_ID";

export type PlaylistID = "WL";

export interface ViewSelector {
  sortFilterSubMenuRenderer: ViewSelectorSortFilterSubMenuRenderer;
}

export interface ViewSelectorSortFilterSubMenuRenderer {
  subMenuItems: SubMenuItem[];
  accessibility: DisabledAccessibilityData;
  trackingParams: string;
  targetId: string;
}

export interface SubMenuItem {
  title: string;
  selected: boolean;
  continuation?: Continuation;
  accessibility: DisabledAccessibilityData;
  subtitle: string;
  trackingParams: string;
  serviceEndpoint?: Endpoint;
}

export interface Endpoint {
  clickTrackingParams: string;
  relatedChipCommand?: RelatedChipCommand;
  commandMetadata?: ContinuationEndpointCommandMetadata;
  continuationCommand?: ServiceEndpointContinuationCommand;
}

export interface ServiceEndpointContinuationCommand {
  token: string;
  request: Request;
  command: ContinuationCommandCommand;
}

export interface ContinuationCommandCommand {
  clickTrackingParams: string;
  showReloadUiCommand: ScrollToEngagementPanelCommandClass;
}

export interface ScrollToEngagementPanelCommandClass {
  targetId: TargetID;
}

export type TargetID =
  | "PAyouchat"
  | "engagement-panel-structured-description"
  | "watch-next-feed"
  | "engagement-panel-searchable-transcript"
  | "engagement-panel-comments-section";

export type Request = "CONTINUATION_REQUEST_TYPE_WATCH_NEXT";

export interface RelatedChipCommand {
  targetSectionIdentifier: string;
  loadCached: boolean;
}

export interface TwoColumnWatchNextResultsResults {
  results: ResultsResults;
}

export interface ResultsResults {
  contents: ResultsContent[];
  trackingParams: string;
}

export interface ResultsContent {
  videoPrimaryInfoRenderer?: VideoPrimaryInfoRenderer;
  videoSecondaryInfoRenderer?: VideoSecondaryInfoRenderer;
  compositeVideoPrimaryInfoRenderer?: BeforeContentVideoIDStartedTrigger;
  itemSectionRenderer?: PurpleItemSectionRenderer;
  merchandiseShelfRenderer?: MerchandiseShelfRenderer;
}

export interface BeforeContentVideoIDStartedTrigger {}

export interface PurpleItemSectionRenderer {
  contents: PurpleContent[];
  trackingParams: string;
  sectionIdentifier?: string;
  targetId?: string;
}

export interface PurpleContent {
  videoMetadataCarouselViewModel?: VideoMetadataCarouselViewModel;
  continuationItemRenderer?: PurpleContinuationItemRenderer;
}

export interface PurpleContinuationItemRenderer {
  trigger: string;
  continuationEndpoint: PurpleContinuationEndpoint;
}

export interface PurpleContinuationEndpoint {
  clickTrackingParams: string;
  commandMetadata: ContinuationEndpointCommandMetadata;
  continuationCommand: ContinuationEndpointContinuationCommand;
}

export interface ContinuationEndpointContinuationCommand {
  token: string;
  request: Request;
}

export interface VideoMetadataCarouselViewModel {
  carouselTitles: CarouselTitle[];
  carouselItems: CarouselItemElement[];
}

export interface CarouselItemElement {
  carouselItemViewModel: CarouselItemViewModel;
}

export interface CarouselItemViewModel {
  itemType: string;
  carouselItem: CarouselItemViewModelCarouselItem;
}

export interface CarouselItemViewModelCarouselItem {
  textCarouselItemViewModel: TextCarouselItemViewModel;
}

export interface TextCarouselItemViewModel {
  iconName: string;
  text: BodyText;
  onTap: TextCarouselItemViewModelOnTap;
  trackingParams: string;
  button: TextCarouselItemViewModelButton;
}

export interface TextCarouselItemViewModelButton {
  buttonViewModel: ButtonButtonViewModel;
}

export interface ButtonButtonViewModel {
  title: string;
  onTap: TextCarouselItemViewModelOnTap;
  style: FluffyStyle;
  trackingParams: string;
  type: ButtonViewModelType;
  buttonSize: PrimaryButtonButtonSize;
}

export type PrimaryButtonButtonSize =
  | "BUTTON_VIEW_MODEL_SIZE_XSMALL"
  | "BUTTON_VIEW_MODEL_SIZE_COMPACT"
  | "BUTTON_VIEW_MODEL_SIZE_DEFAULT";

export interface TextCarouselItemViewModelOnTap {
  innertubeCommand: PurpleInnertubeCommand;
}

export interface PurpleInnertubeCommand {
  clickTrackingParams: string;
  setLiveChatCollapsedStateAction: BeforeContentVideoIDStartedTrigger;
}

export type FluffyStyle =
  | "BUTTON_VIEW_MODEL_STYLE_MONO"
  | "BUTTON_VIEW_MODEL_STYLE_OVERLAY_DARK";

export type ButtonViewModelType =
  | "BUTTON_VIEW_MODEL_TYPE_TONAL"
  | "BUTTON_VIEW_MODEL_TYPE_TEXT";

export interface BodyText {
  content: string;
}

export interface CarouselTitle {
  carouselTitleViewModel: CarouselTitleViewModel;
}

export interface CarouselTitleViewModel {
  title: string;
  previousButton: MenuButton;
  nextButton: MenuButton;
}

export interface MenuButton {
  buttonViewModel: MenuButtonButtonViewModel;
}

export interface MenuButtonButtonViewModel {
  iconName: IconName;
  accessibilityText: OverflowMenuA11YLabel;
  style: FluffyStyle;
  trackingParams: string;
  type: ButtonViewModelType;
  buttonSize: PrimaryButtonButtonSize;
  state?: StateEnum;
  iconImageFlipForRtl?: boolean;
  onTap?: PurpleOnTap;
}

export type OverflowMenuA11YLabel =
  | "Next"
  | "Previous"
  | "Send"
  | "Watch later"
  | "Add to queue"
  | "Added"
  | "More actions";

export type IconName =
  | "CHEVRON_RIGHT"
  | "CHEVRON_LEFT"
  | "send"
  | "WATCH_LATER"
  | "ADD_TO_QUEUE_TAIL"
  | "CHECK"
  | "MORE_VERT";

export interface PurpleOnTap {
  innertubeCommand: FluffyInnertubeCommand;
}

export interface FluffyInnertubeCommand {
  clickTrackingParams: string;
  commandMetadata?: ContinuationEndpointCommandMetadata;
  playlistEditEndpoint?: PurplePlaylistEditEndpoint;
  signalServiceEndpoint?: InnertubeCommandSignalServiceEndpoint;
  showSheetCommand?: PurpleShowSheetCommand;
}

export interface PurplePlaylistEditEndpoint {
  playlistId: PlaylistID;
  actions: TentacledAction[];
}

export interface TentacledAction {
  addedVideoId?: string;
  action: ActionEnum;
  removedVideoId?: string;
}

export interface PurpleShowSheetCommand {
  panelLoadingStrategy: PurplePanelLoadingStrategy;
}

export interface PurplePanelLoadingStrategy {
  inlineContent: InlineContent;
}

export interface InlineContent {
  sheetViewModel: SheetViewModel;
}

export interface SheetViewModel {
  content: SheetViewModelContent;
}

export interface SheetViewModelContent {
  listViewModel: ListViewModel;
}

export interface ListViewModel {
  listItems: ListViewModelListItem[];
}

export interface ListViewModelListItem {
  listItemViewModel?: ListItemViewModel;
  downloadListItemViewModel?: DownloadListItemViewModel;
}

export interface DownloadListItemViewModel {
  rendererContext: DownloadListItemViewModelRendererContext;
}

export interface DownloadListItemViewModelRendererContext {
  commandContext: PurpleCommandContext;
}

export interface PurpleCommandContext {
  onTap: FluffyOnTap;
}

export interface FluffyOnTap {
  innertubeCommand: OnTapServiceEndpoint;
}

export interface OnTapServiceEndpoint {
  clickTrackingParams: string;
  offlineVideoEndpoint: OfflineVideoEndpoint;
}

export interface OfflineVideoEndpoint {
  videoId: string;
  onAddCommand: OnAddCommand;
}

export interface OnAddCommand {
  clickTrackingParams: string;
  getDownloadActionCommand: GetDownloadActionCommand;
}

export interface GetDownloadActionCommand {
  videoId: string;
  params: GetDownloadActionCommandParams;
  offlineabilityEntityKey?: string;
  isCrossDeviceDownload: boolean;
}

export type GetDownloadActionCommandParams = "CAEQAA%3D%3D" | "CAIQAA%3D%3D";

export interface ListItemViewModel {
  title: BodyText;
  leadingImage: IconImage;
  rendererContext: ListItemViewModelRendererContext;
}

export interface IconImage {
  sources: IconImageElement[];
}

export interface IconImageElement {
  clientResource: ClientResource;
}

export interface ClientResource {
  imageName: IconNameEnum;
}

export type IconNameEnum =
  | "SPARK"
  | "LIVE"
  | "MUSIC"
  | "ADD_TO_QUEUE_TAIL"
  | "WATCH_LATER"
  | "BOOKMARK_BORDER"
  | "SHARE"
  | "NOT_INTERESTED"
  | "REMOVE"
  | "FLAG"
  | "CHECK_CIRCLE_FILLED"
  | "AUDIO_BADGE"
  | "ARROW_DIAGONAL_UP_RIGHT_FILLED"
  | "EXPAND_LESS"
  | "EXPAND_MORE";

export interface ListItemViewModelRendererContext {
  loggingContext?: PurpleLoggingContext;
  commandContext: FluffyCommandContext;
}

export interface FluffyCommandContext {
  onTap: TentacledOnTap;
}

export interface TentacledOnTap {
  innertubeCommand: TentacledInnertubeCommand;
}

export interface TentacledInnertubeCommand {
  clickTrackingParams: string;
  commandMetadata: FluffyCommandMetadata;
  signalServiceEndpoint?: InnertubeCommandSignalServiceEndpoint;
  playlistEditEndpoint?: ServiceEndpointPlaylistEditEndpoint;
  showSheetCommand?: NavigationEndpointShowSheetCommand;
  shareEntityServiceEndpoint?: ShareEntityServiceEndpoint;
  feedbackEndpoint?: PurpleFeedbackEndpoint;
  getReportFormEndpoint?: YpcGetOffersEndpoint;
}

export interface FluffyCommandMetadata {
  webCommandMetadata?: FluffyWebCommandMetadata;
  interactionLoggingCommandMetadata?: InteractionLoggingCommandMetadata;
}

export interface PurpleFeedbackEndpoint {
  feedbackToken: string;
  uiActions: UIActions;
  actions: FeedbackEndpointAction[];
  contentId: string;
}

export interface FeedbackEndpointAction {
  clickTrackingParams: string;
  replaceEnclosingAction: ReplaceEnclosingAction;
}

export interface ReplaceEnclosingAction {
  item: ReplaceEnclosingActionItem;
}

export interface ReplaceEnclosingActionItem {
  notificationMultiActionRenderer: NotificationMultiActionRenderer;
}

export interface NotificationMultiActionRenderer {
  responseText: ShortViewCountTextClass;
  buttons: NotificationMultiActionRendererButton[];
  trackingParams: string;
  dismissalViewStyle: DismissalViewStyle;
}

export interface NotificationMultiActionRendererButton {
  buttonRenderer: PurpleButtonRenderer;
}

export interface PurpleButtonRenderer {
  style: StyleTypeEnum;
  text: ViewsClass;
  serviceEndpoint?: PurpleServiceEndpoint;
  trackingParams: string;
  command?: ClickthroughEndpointClass;
}

export interface ClickthroughEndpointClass {
  clickTrackingParams: string;
  commandMetadata: AutoplayVideoCommandMetadata;
  urlEndpoint: CommandURLEndpoint;
  loggingUrls?: PtrackingURL[];
}

export interface PtrackingURL {
  baseUrl: string;
}

export interface PurpleServiceEndpoint {
  clickTrackingParams: string;
  commandMetadata: ContinuationEndpointCommandMetadata;
  undoFeedbackEndpoint?: UndoFeedbackEndpoint;
  signalServiceEndpoint?: PurpleSignalServiceEndpoint;
}

export interface PurpleSignalServiceEndpoint {
  signal: SignalServiceEndpointSignal;
  actions: StickyAction[];
}

export interface StickyAction {
  clickTrackingParams: string;
  signalAction: SignalAction;
}

export interface SignalAction {
  signal: SignalActionSignal;
  targetId: string;
}

export type SignalActionSignal = "TELL_US_WHY";

export interface UndoFeedbackEndpoint {
  undoToken: string;
  actions: UndoFeedbackEndpointAction[];
  contentId: string;
}

export interface UndoFeedbackEndpointAction {
  clickTrackingParams: string;
  undoFeedbackAction: AdsEngagementPanelContentRenderer;
}

export type DismissalViewStyle = "DISMISSAL_VIEW_STYLE_COMPACT_TALL";

export interface ShortViewCountTextClass {
  accessibility?: DisabledAccessibilityData;
  simpleText?: string;
  runs?: SubtitleRun[];
}

export interface UIActions {
  hideEnclosingContainer: boolean;
}

export interface YpcGetOffersEndpoint {
  params: string;
}

export interface ShareEntityServiceEndpoint {
  serializedShareEntity: string;
  commands: ShareEntityServiceEndpointCommand[];
}

export interface ShareEntityServiceEndpointCommand {
  clickTrackingParams: string;
  openPopupAction: PurpleOpenPopupAction;
}

export interface PurpleOpenPopupAction {
  popup: TentacledPopup;
  popupType: PopupType;
  beReused: boolean;
}

export interface TentacledPopup {
  unifiedSharePanelRenderer: UnifiedSharePanelRenderer;
}

export interface UnifiedSharePanelRenderer {
  trackingParams: string;
  showLoadingSpinner: boolean;
}

export interface InnertubeCommandSignalServiceEndpoint {
  signal: SignalServiceEndpointSignal;
  actions: IndigoAction[];
}

export interface IndigoAction {
  clickTrackingParams: string;
  addToPlaylistCommand: AddToPlaylistCommand;
}

export interface AddToPlaylistCommand {
  openMiniplayer: boolean;
  openListPanel?: boolean;
  videoId: string;
  listType: AddToPlaylistCommandListType;
  onCreateListCommand: OnCreateListCommand;
  videoIds: string[];
  videoCommand: VideoCommand;
}

export type AddToPlaylistCommandListType = "PLAYLIST_EDIT_LIST_TYPE_QUEUE";

export interface OnCreateListCommand {
  clickTrackingParams: string;
  commandMetadata: ContinuationEndpointCommandMetadata;
  createPlaylistServiceEndpoint: CreatePlaylistServiceEndpoint;
}

export interface CreatePlaylistServiceEndpoint {
  videoIds: string[];
  params: CreatePlaylistServiceEndpointParams;
}

export type CreatePlaylistServiceEndpointParams = "CAQ%3D";

export interface VideoCommand {
  clickTrackingParams: string;
  commandMetadata: AutoplayVideoCommandMetadata;
  watchEndpoint: VideoCommandWatchEndpoint;
}

export interface VideoCommandWatchEndpoint {
  videoId: string;
  playerParams?: FluffyPlayerParams;
  watchEndpointSupportedOnesieConfig: WatchEndpointSupportedOnesieConfig;
}

export type FluffyPlayerParams =
  | "ugUEEgJlbg%3D%3D"
  | "0gcJCZgAKgI3ePta"
  | "ugUHEgVlbi1VUw%3D%3D"
  | "ugUEEgJlbtIHCQmYACoCN3j7Wg%3D%3D"
  | "ugUEEgJlbtIHCQlFBHX-syszgw%3D%3D"
  | "0gcJCUUEdf6zKzOD"
  | "0gcJCWsD5mK_OTUh";

export interface PurpleLoggingContext {
  loggingDirectives: RunLoggingDirectives;
}

export interface RunLoggingDirectives {
  trackingParams: string;
  visibility: VisibilityClass;
}

export type StateEnum = "BUTTON_VIEW_MODEL_STATE_ACTIVE";

export interface MerchandiseShelfRenderer {
  title: string;
  items: MerchandiseShelfRendererItem[];
  trackingParams: string;
  showText: string;
  hideText: string;
  actionButton: MerchandiseShelfRendererActionButton;
  shelfType: string;
}

export interface MerchandiseShelfRendererActionButton {
  menuRenderer: ActionButtonMenuRenderer;
}

export interface ActionButtonMenuRenderer {
  items: FluffyItem[];
  trackingParams: string;
  accessibility: DisabledAccessibilityData;
}

export interface FluffyItem {
  menuServiceItemRenderer: PurpleMenuServiceItemRenderer;
}

export interface PurpleMenuServiceItemRenderer {
  text: ShortViewCountText;
  icon: Icon;
  serviceEndpoint: FluffyServiceEndpoint;
  trackingParams: string;
  loggingDirectives?: MenuServiceItemRendererLoggingDirectives;
}

export interface MenuServiceItemRendererLoggingDirectives {
  trackingParams: string;
  visibility: VisibilityClass;
  gestures: VisibilityClass;
}

export interface FluffyServiceEndpoint {
  clickTrackingParams: string;
  openPopupAction?: ServiceEndpointOpenPopupAction;
  commandMetadata?: ContinuationEndpointCommandMetadata;
  getReportFormEndpoint?: YpcGetOffersEndpoint;
}

export interface ServiceEndpointOpenPopupAction {
  popup: StickyPopup;
  popupType: PopupType;
}

export interface StickyPopup {
  fancyDismissibleDialogRenderer: FancyDismissibleDialogRenderer;
}

export interface FancyDismissibleDialogRenderer {
  dialogMessage: FancyDismissibleDialogRendererDialogMessage;
  confirmLabel: LiveIndicatorText;
  trackingParams: string;
}

export interface FancyDismissibleDialogRendererDialogMessage {
  runs: PurpleRun[];
}

export interface PurpleRun {
  text: string;
  textColor?: number;
  navigationEndpoint?: ClickthroughEndpointClass;
}

export interface ShortViewCountText {
  accessibility: DisabledAccessibilityData;
  simpleText: string;
}

export interface MerchandiseShelfRendererItem {
  merchandiseItemRenderer: MerchandiseItemRenderer;
}

export interface MerchandiseItemRenderer {
  title: string;
  description: string;
  thumbnail: BackgroundClass;
  price: string;
  vendorName: MerchantNameEnum;
  trackingParams: string;
  buttonText: ButtonText;
  buttonCommand: OnClickCommandClass;
  accessibilityTitle: string;
  buttonAccessibilityText: ButtonAccessibilityText;
  fromVendorText: FromVendorText;
  additionalFeesText: string;
  showOpenInNewIcon: boolean;
}

export type ButtonAccessibilityText = "Buy merchandise from Spring";

export interface OnClickCommandClass {
  clickTrackingParams: string;
  commandExecutorCommand: OnClickCommandCommandExecutorCommand;
}

export interface OnClickCommandCommandExecutorCommand {
  commands: IndigoCommand[];
}

export interface IndigoCommand {
  clickTrackingParams: string;
  commandMetadata: TentacledCommandMetadata;
  feedbackEndpoint?: CommandFeedbackEndpoint;
  urlEndpoint?: CommandURLEndpoint;
}

export interface TentacledCommandMetadata {
  webCommandMetadata: StickyWebCommandMetadata;
}

export interface StickyWebCommandMetadata {
  sendPost?: boolean;
  apiUrl?: FluffyAPIURL;
  url?: string;
  webPageType?: WebPageType;
  rootVe?: number;
}

export type FluffyAPIURL = "/youtubei/v1/feedback" | "/youtubei/v1/browse";

export interface CommandFeedbackEndpoint {
  feedbackToken: string;
}

export type ButtonText = "Shop";

export type FromVendorText = "From Spring";

export interface BackgroundClass {
  thumbnails: ThumbnailElement[];
}

export interface ThumbnailElement {
  url: string;
  width?: number;
  height?: number;
}

export type MerchantNameEnum = "Spring";

export interface VideoPrimaryInfoRenderer {
  title: SuperTitleLink;
  viewCount: ViewCount;
  videoActions: VideoActions;
  trackingParams: string;
  updatedMetadataEndpoint?: VideoPrimaryInfoRendererUpdatedMetadataEndpoint;
  dateText: LiveIndicatorText;
  superTitleLink?: SuperTitleLink;
  relativeDateText?: ShortViewCountText;
}

export interface SuperTitleLink {
  runs: SuperTitleLinkRun[];
}

export interface SuperTitleLinkRun {
  text: string;
  navigationEndpoint?: CommandClass;
  loggingDirectives?: RunLoggingDirectives;
}

export interface CommandClass {
  clickTrackingParams: string;
  commandMetadata: ChannelNavigationEndpointCommandMetadata;
  browseEndpoint: CommandBrowseEndpoint;
}

export interface CommandBrowseEndpoint {
  browseId: ID;
  params: string;
}

export type ID =
  | "FEhashtag"
  | "UC9p_lqQ0FEDz327Vgf5JwqA"
  | "UCpl8Z7Q7_SRMIGB1JLQNJRg"
  | "UCsBjURrPoezykLs9EqgamOA"
  | "UC6jv4bdpK-D1YEMNU7q2gxg"
  | "UC6-JDSboWlMjEadt1Ge-EFg";

export interface ChannelNavigationEndpointCommandMetadata {
  webCommandMetadata: IndigoWebCommandMetadata;
}

export interface IndigoWebCommandMetadata {
  url: string;
  webPageType: WebPageType;
  rootVe: number;
  apiUrl?: FluffyAPIURL;
}

export interface VideoPrimaryInfoRendererUpdatedMetadataEndpoint {
  clickTrackingParams: string;
  commandMetadata: ContinuationEndpointCommandMetadata;
  updatedMetadataEndpoint: UpdatedMetadataEndpointUpdatedMetadataEndpoint;
}

export interface UpdatedMetadataEndpointUpdatedMetadataEndpoint {
  videoId: ExternalVideoIDEnum;
  initialDelayMs: number;
  params: string;
}

export type ExternalVideoIDEnum =
  | "Z75wbmjV7J4"
  | "PgFSZgSOH-Q"
  | "n2Fluyr3lbc"
  | "NeWxZAYPZuI";

export interface VideoActions {
  menuRenderer: VideoActionsMenuRenderer;
}

export interface VideoActionsMenuRenderer {
  items: TentacledItem[];
  trackingParams: string;
  topLevelButtons: TopLevelButtonElement[];
  accessibility: DisabledAccessibilityData;
  flexibleItems: FlexibleItem[];
}

export interface FlexibleItem {
  menuFlexibleItemRenderer: MenuFlexibleItemRenderer;
}

export interface MenuFlexibleItemRenderer {
  menuItem: MenuItem;
  topLevelButton: MenuFlexibleItemRendererTopLevelButton;
}

export interface MenuItem {
  menuServiceItemRenderer?: MenuItemMenuServiceItemRenderer;
  menuServiceItemDownloadRenderer?: MenuServiceItemDownloadRenderer;
}

export interface MenuServiceItemDownloadRenderer {
  serviceEndpoint: OnTapServiceEndpoint;
  trackingParams: string;
}

export interface MenuItemMenuServiceItemRenderer {
  text: ViewsClass;
  icon: Icon;
  serviceEndpoint: MenuServiceItemRendererInnertubeCommand;
  trackingParams: string;
  isDisabled?: boolean;
}

export interface MenuServiceItemRendererInnertubeCommand {
  clickTrackingParams: string;
  commandMetadata?: ShowPlaybackRateUpsellPanelCommandCommandMetadata;
  showSheetCommand?: NavigationEndpointShowSheetCommand;
  changeEngagementPanelVisibilityAction?: ChangeEngagementPanelVisibilityAction;
  showEngagementPanelEndpoint?: InnertubeCommandShowEngagementPanelEndpoint;
}

export interface ShowPlaybackRateUpsellPanelCommandCommandMetadata {
  interactionLoggingCommandMetadata: InteractionLoggingCommandMetadata;
}

export interface InnertubeCommandShowEngagementPanelEndpoint {
  panelIdentifier: PanelIdentifier;
  engagementPanel: ShowEngagementPanelEndpointEngagementPanel;
  sourcePanelIdentifier: string;
  blockIfPanelOpen: boolean;
}

export interface ShowEngagementPanelEndpointEngagementPanel {
  engagementPanelSectionListRenderer: PurpleEngagementPanelSectionListRenderer;
}

export interface PurpleEngagementPanelSectionListRenderer {
  panelIdentifier: PanelIdentifier;
  header: PurpleHeader;
  content: FluffyContent;
  veType: number;
  disablePullRefresh: boolean;
  footer: Footer;
  onShowCommands: PurpleOnShowCommand[];
  onCloseCommand: PurpleOnCloseCommand;
  loggingDirectives: RunLoggingDirectives;
}

export interface FluffyContent {
  sectionListRenderer: PurpleSectionListRenderer;
}

export interface PurpleSectionListRenderer {
  contents: TentacledContent[];
  trackingParams: string;
  targetId: ItemSectionTargetID;
  disablePullToRefresh: boolean;
  webComponentHint: WebComponentHint;
}

export interface TentacledContent {
  itemSectionRenderer: FluffyItemSectionRenderer;
}

export interface FluffyItemSectionRenderer {
  contents: StickyContent[];
  trackingParams: string;
  targetId: InsertByPositionInSectionSectionTargetID;
}

export interface StickyContent {
  youChatItemViewModel: YouChatItemViewModel;
}

export interface YouChatItemViewModel {
  text?: BodyText;
  hideIcon?: boolean;
  transparentBackground?: boolean;
  removeIcon?: boolean;
  icon?: IconImage;
  chipsData?: ChipsData;
  targetId?: string;
}

export interface ChipsData {
  chipData: ChipDatum[];
  isHorizontal: boolean;
  onShowAnimationMs: number;
  onShowDelayMs: number;
  pendingStateEntityKey: string;
}

export interface ChipDatum {
  id: string;
  text: BodyText;
  showIcon: boolean;
  onClick: OnClick;
  continuation: string;
  transparentWhenLoading: boolean;
}

export interface OnClick {
  clickTrackingParams: string;
  listMutationCommand: OnClickListMutationCommand;
}

export interface OnClickListMutationCommand {
  operations: PurpleOperations;
}

export interface PurpleOperations {
  operations: PurpleOperation[];
  scrollConfig: ScrollConfig;
}

export interface PurpleOperation {
  insertItemSectionContent: PurpleInsertItemSectionContent;
}

export interface PurpleInsertItemSectionContent {
  contents: IndigoContent[];
  insertByPositionInSection: InsertByPositionInSection;
}

export interface IndigoContent {
  chatUserTurnViewModel?: ChatUserTurnViewModel;
  chatLoadingViewModel?: ChatLoadingViewModel;
}

export interface ChatLoadingViewModel {
  targetId: ItemTargetIDEnum;
  animation: Animation;
  loadingAnimationA11yLabel: LoadingAnimationA11YLabel;
  darkThemeAnimation: Animation;
}

export interface Animation {
  lottieAnimationViewModel: LottieAnimationViewModel;
}

export interface LottieAnimationViewModel {
  trustedAnimationUrl: URL;
  loop: boolean;
}

export type LoadingAnimationA11YLabel = "Load in progress.";

export type ItemTargetIDEnum = "loading_response_message_id";

export interface ChatUserTurnViewModel {
  text: string;
  backgroundStyle: string;
}

export interface InsertByPositionInSection {
  sectionTargetId: InsertByPositionInSectionSectionTargetID;
  position: InsertByPositionInSectionPosition;
}

export type InsertByPositionInSectionPosition = "INSERTION_POSITION_LAST";

export type InsertByPositionInSectionSectionTargetID =
  "youchat_messages_section";

export interface ScrollConfig {
  scrollToItem: ScrollToItem;
}

export interface ScrollToItem {
  item: ScrollToItemItem;
  scrollPosition: ScrollPosition;
}

export interface ScrollToItemItem {
  itemTargetId: ItemTargetIDEnum;
  sectionTargetId: ItemSectionTargetID;
}

export type ItemSectionTargetID = "youchat_section_list";

export type ScrollPosition = "SCROLL_POSITION_END";

export interface WebComponentHint {
  componentVersion: string;
}

export interface Footer {
  chatInputViewModel: ChatInputViewModel;
}

export interface ChatInputViewModel {
  inputComposerViewModel: ChatInputViewModelInputComposerViewModel;
  sendButton: MenuButton;
  loadingAnimationA11yLabel: LoadingAnimationA11YLabel;
  disclaimerText: DisclaimerText;
}

export interface DisclaimerText {
  content: string;
  commandRuns: DisclaimerTextCommandRun[];
  styleRuns: DisclaimerTextStyleRun[];
  attachmentRuns: DisclaimerTextAttachmentRun[];
}

export interface DisclaimerTextAttachmentRun {
  startIndex: number;
  length: number;
  element: PurpleElement;
  alignment: Alignment;
}

export type Alignment = "ALIGNMENT_VERTICAL_CENTER";

export interface PurpleElement {
  type: PurpleType;
  properties: PurpleProperties;
}

export interface PurpleProperties {
  layoutProperties: PurpleLayoutProperties;
}

export interface PurpleLayoutProperties {
  height: Height;
  width: Height;
  margin: PurpleMargin;
}

export interface Height {
  value: number;
  unit: Unit;
}

export type Unit = "DIMENSION_UNIT_POINT";

export interface PurpleMargin {
  end: Height;
}

export interface PurpleType {
  imageType: PurpleImageType;
}

export interface PurpleImageType {
  image: VideoAttributeViewModelImage;
}

export interface VideoAttributeViewModelImage {
  sources: CommonConfig[];
}

export interface DisclaimerTextCommandRun {
  startIndex: number;
  length: number;
  onTap: InteractionOnTap;
}

export interface InteractionOnTap {
  innertubeCommand: ClickthroughEndpointClass;
}

export interface DisclaimerTextStyleRun {
  startIndex: number;
  length: number;
  fontColor?: number;
  underline?: string;
  weightLabel?: string;
}

export interface ChatInputViewModelInputComposerViewModel {
  inputComposerViewModel: InputComposerViewModelInputComposerViewModel;
}

export interface InputComposerViewModelInputComposerViewModel {
  inputFormField: InputFormField;
  continuation: string;
  youchatPendingResponseEntityKey: string;
  onSubmitCommand: OnSubmitCommand;
  sectionTargetId: InsertByPositionInSectionSectionTargetID;
  loadingConfig: LoadingConfig;
  chatUserTurnBackgroundStyle: string;
  rendererContext: InputComposerViewModelRendererContext;
}

export interface InputFormField {
  textFieldViewModel: TextFieldViewModel;
}

export interface TextFieldViewModel {
  displayProperties: DisplayProperties;
  contentProperties: ContentProperties;
}

export interface ContentProperties {
  placeholderText: string;
  maxCharacterCount: number;
}

export interface DisplayProperties {
  hideBorder: boolean;
}

export interface LoadingConfig {
  loadingAnimationA11yLabel: LoadingAnimationA11YLabel;
}

export interface OnSubmitCommand {
  innertubeCommand: OnSubmitCommandInnertubeCommand;
}

export interface OnSubmitCommandInnertubeCommand {
  clickTrackingParams: string;
  listMutationCommand: InnertubeCommandListMutationCommand;
}

export interface InnertubeCommandListMutationCommand {
  operations: FluffyOperations;
}

export interface FluffyOperations {
  operations: FluffyOperation[];
  scrollConfig: ScrollConfig;
}

export interface FluffyOperation {
  insertItemSectionContent: FluffyInsertItemSectionContent;
}

export interface FluffyInsertItemSectionContent {
  contents: IndecentContent[];
  insertByPositionInSection: InsertByPositionInSection;
}

export interface IndecentContent {
  chatLoadingViewModel: ChatLoadingViewModel;
}

export interface InputComposerViewModelRendererContext {
  loggingContext: FluffyLoggingContext;
}

export interface FluffyLoggingContext {
  loggingDirectives: PurpleLoggingDirectives;
}

export interface PurpleLoggingDirectives {
  trackingParams: string;
  visibility: VisibilityClass;
  clientVeSpec: ClientVeSpec;
}

export interface ClientVeSpec {
  uiType: number;
  veCounter: number;
}

export interface PurpleHeader {
  engagementPanelTitleHeaderRenderer: PurpleEngagementPanelTitleHeaderRenderer;
}

export interface PurpleEngagementPanelTitleHeaderRenderer {
  title: Subtitle;
  visibilityButton: VisibilityButton;
  trackingParams: string;
}

export interface VisibilityButton {
  buttonRenderer: FluffyButtonRenderer;
}

export interface FluffyButtonRenderer {
  icon: Icon;
  accessibility: AccessibilityData;
  trackingParams: string;
  accessibilityData: DisabledAccessibilityData;
  command: ShowLessCommandElement;
}

export interface ShowLessCommandElement {
  clickTrackingParams: string;
  changeEngagementPanelVisibilityAction: ChangeEngagementPanelVisibilityAction;
}

export interface PurpleOnCloseCommand {
  clickTrackingParams: string;
  elementsCommand: ElementsCommand;
}

export interface ElementsCommand {
  setEntityCommand: SetEntityCommand;
}

export interface SetEntityCommand {
  identifier: string;
  entity: string;
}

export interface PurpleOnShowCommand {
  clickTrackingParams: string;
  scrollToEngagementPanelCommand: ScrollToEngagementPanelCommandClass;
}

export interface MenuFlexibleItemRendererTopLevelButton {
  buttonViewModel?: PurpleButtonViewModel;
  downloadButtonRenderer?: DownloadButtonRenderer;
}

export interface PurpleButtonViewModel {
  iconName: string;
  title: string;
  onTap: StickyOnTap;
  accessibilityText: string;
  style: FluffyStyle;
  trackingParams: string;
  isFullWidth?: boolean;
  type: ButtonViewModelType;
  buttonSize: PrimaryButtonButtonSize;
  tooltip?: string;
  targetId?: string;
}

export interface StickyOnTap {
  serialCommand?: PurpleSerialCommand;
  innertubeCommand?: StickyInnertubeCommand;
}

export interface StickyInnertubeCommand {
  clickTrackingParams: string;
  showEngagementPanelEndpoint: InnertubeCommandShowEngagementPanelEndpoint;
}

export interface PurpleSerialCommand {
  commands: IndecentCommand[];
}

export interface IndecentCommand {
  logGestureCommand?: LogGestureCommand;
  innertubeCommand?: MenuServiceItemRendererInnertubeCommand;
}

export interface LogGestureCommand {
  gestureType: GestureType;
  trackingParams: string;
}

export type GestureType = "GESTURE_EVENT_TYPE_LOG_GENERIC_CLICK";

export interface DownloadButtonRenderer {
  trackingParams: string;
  style: StyleTypeEnum;
  size: DownloadButtonRendererSize;
  targetId: string;
  command: OnTapServiceEndpoint;
}

export interface TentacledItem {
  menuServiceItemRenderer: FluffyMenuServiceItemRenderer;
}

export interface FluffyMenuServiceItemRenderer {
  text: Subtitle;
  icon: Icon;
  serviceEndpoint: TentacledServiceEndpoint;
  trackingParams: string;
  isDisabled?: boolean;
}

export interface TentacledServiceEndpoint {
  clickTrackingParams: string;
  showEngagementPanelEndpoint?: PurpleShowEngagementPanelEndpoint;
  commandMetadata?: FluffyCommandMetadata;
  showSheetCommand?: NavigationEndpointShowSheetCommand;
  changeEngagementPanelVisibilityAction?: ChangeEngagementPanelVisibilityAction;
  getPdgBuyFlowCommand?: YpcGetOffersEndpoint;
}

export interface PurpleShowEngagementPanelEndpoint {
  identifier: GutParams;
  globalConfiguration: YpcGetOffersEndpoint;
  engagementPanelPresentationConfigs: EngagementPanelPresentationConfigs;
}

export interface EngagementPanelPresentationConfigs {
  engagementPanelPopupPresentationConfig: EngagementPanelPopupPresentationConfig;
}

export interface EngagementPanelPopupPresentationConfig {
  popupType: string;
}

export interface TopLevelButtonElement {
  segmentedLikeDislikeButtonViewModel?: SegmentedLikeDislikeButtonViewModel;
  buttonViewModel?: QuickActionButtonButtonViewModel;
}

export interface QuickActionButtonButtonViewModel {
  iconName: IconNameEnum;
  title?: string;
  onTap: IndigoOnTap;
  accessibilityText: string;
  style: PrimaryButtonStyle;
  trackingParams: string;
  isFullWidth: boolean;
  type: ButtonViewModelType;
  buttonSize: PurpleButtonSize;
  state: StateEnum;
  accessibilityId: string;
  tooltip: string;
  enableIconButton?: boolean;
}

export type PurpleButtonSize =
  | "BUTTON_VIEW_MODEL_SIZE_DEFAULT"
  | "BUTTON_VIEW_MODEL_SIZE_LARGE";

export interface IndigoOnTap {
  serialCommand: FluffySerialCommand;
}

export interface FluffySerialCommand {
  commands: HilariousCommand[];
}

export interface HilariousCommand {
  logGestureCommand?: LogGestureCommand;
  innertubeCommand?: IndigoInnertubeCommand;
}

export interface IndigoInnertubeCommand {
  clickTrackingParams: string;
  commandMetadata: ContinuationEndpointCommandMetadata;
  shareEntityServiceEndpoint: ShareEntityServiceEndpoint;
}

export type PrimaryButtonStyle =
  | "BUTTON_VIEW_MODEL_STYLE_MONO"
  | "BUTTON_VIEW_MODEL_STYLE_OVERLAY";

export interface SegmentedLikeDislikeButtonViewModel {
  likeButtonViewModel: SegmentedLikeDislikeButtonViewModelLikeButtonViewModel;
  dislikeButtonViewModel: SegmentedLikeDislikeButtonViewModelDislikeButtonViewModel;
  iconType: string;
  likeCountEntity: VisibleOnLoad;
  dynamicLikeCountUpdateData: DynamicLikeCountUpdateData;
  teasersOrderEntityKey: string;
}

export interface SegmentedLikeDislikeButtonViewModelDislikeButtonViewModel {
  dislikeButtonViewModel: DislikeButtonViewModelDislikeButtonViewModel;
}

export interface DislikeButtonViewModelDislikeButtonViewModel {
  toggleButtonViewModel: DislikeButtonViewModelToggleButtonViewModel;
  dislikeEntityKey: string;
}

export interface DislikeButtonViewModelToggleButtonViewModel {
  toggleButtonViewModel: PurpleToggleButtonViewModel;
}

export interface PurpleToggleButtonViewModel {
  defaultButtonViewModel: PurpleDefaultButtonViewModel;
  toggledButtonViewModel: PurpleToggledButtonViewModel;
  trackingParams: string;
  isTogglingDisabled: boolean;
}

export interface PurpleDefaultButtonViewModel {
  buttonViewModel: FluffyButtonViewModel;
}

export interface FluffyButtonViewModel {
  iconName: StatusEnum;
  title?: string;
  onTap: IndecentOnTap;
  accessibilityText: string;
  style: PrimaryButtonStyle;
  trackingParams: string;
  isFullWidth: boolean;
  type: ButtonViewModelType;
  buttonSize: PurpleButtonSize;
  accessibilityId: AccessibilityID;
  tooltip: Tooltip;
  enableIconButton?: boolean;
}

export type AccessibilityID =
  | "id.video.dislike.button"
  | "id.video.like.button";

export type StatusEnum = "DISLIKE" | "LIKE";

export interface IndecentOnTap {
  serialCommand: TentacledSerialCommand;
}

export interface TentacledSerialCommand {
  commands: AmbitiousCommand[];
}

export interface AmbitiousCommand {
  logGestureCommand?: LogGestureCommand;
  innertubeCommand?: IndecentInnertubeCommand;
}

export interface IndecentInnertubeCommand {
  clickTrackingParams: string;
  commandMetadata: ContinuationEndpointCommandMetadata;
  likeEndpoint: PurpleLikeEndpoint;
}

export interface PurpleLikeEndpoint {
  status: StatusEnum;
  target: TargetClass;
  dislikeParams: string;
}

export interface TargetClass {
  videoId: ExternalVideoIDEnum;
}

export type Tooltip = "I dislike this" | "Unlike";

export interface PurpleToggledButtonViewModel {
  buttonViewModel: TentacledButtonViewModel;
}

export interface TentacledButtonViewModel {
  iconName: StatusEnum;
  title?: string;
  onTap: HilariousOnTap;
  accessibilityText: string;
  style: PrimaryButtonStyle;
  trackingParams: string;
  isFullWidth: boolean;
  type: ButtonViewModelType;
  buttonSize: PurpleButtonSize;
  accessibilityId: AccessibilityID;
  tooltip: Tooltip;
  enableIconButton?: boolean;
}

export interface HilariousOnTap {
  serialCommand: StickySerialCommand;
}

export interface StickySerialCommand {
  commands: CunningCommand[];
}

export interface CunningCommand {
  logGestureCommand?: LogGestureCommand;
  innertubeCommand?: HilariousInnertubeCommand;
}

export interface HilariousInnertubeCommand {
  clickTrackingParams: string;
  commandMetadata: ContinuationEndpointCommandMetadata;
  likeEndpoint: FluffyLikeEndpoint;
}

export interface FluffyLikeEndpoint {
  status: Status;
  target: TargetClass;
  removeLikeParams: string;
}

export type Status = "INDIFFERENT";

export interface DynamicLikeCountUpdateData {
  updateStatusKey: string;
  placeholderLikeCountValuesKey: string;
  updateDelayLoopId: string;
  updateDelaySec: number;
}

export interface SegmentedLikeDislikeButtonViewModelLikeButtonViewModel {
  likeButtonViewModel: LikeButtonViewModelLikeButtonViewModel;
}

export interface LikeButtonViewModelLikeButtonViewModel {
  toggleButtonViewModel: LikeButtonViewModelToggleButtonViewModel;
  likeStatusEntityKey: string;
  likeStatusEntity: LikeStatusEntity;
}

export interface LikeStatusEntity {
  key: string;
  likeStatus: Status;
}

export interface LikeButtonViewModelToggleButtonViewModel {
  toggleButtonViewModel: FluffyToggleButtonViewModel;
}

export interface FluffyToggleButtonViewModel {
  defaultButtonViewModel: FluffyDefaultButtonViewModel;
  toggledButtonViewModel: PurpleToggledButtonViewModel;
  identifier: string;
  trackingParams: string;
  isTogglingDisabled: boolean;
}

export interface FluffyDefaultButtonViewModel {
  buttonViewModel: StickyButtonViewModel;
}

export interface StickyButtonViewModel {
  iconName: StatusEnum;
  title: string;
  onTap: AmbitiousOnTap;
  accessibilityText: string;
  style: PrimaryButtonStyle;
  trackingParams: string;
  isFullWidth: boolean;
  type: ButtonViewModelType;
  buttonSize: PurpleButtonSize;
  accessibilityId: AccessibilityID;
  tooltip: string;
  enableIconButton?: boolean;
}

export interface AmbitiousOnTap {
  serialCommand: IndigoSerialCommand;
}

export interface IndigoSerialCommand {
  commands: MagentaCommand[];
}

export interface MagentaCommand {
  logGestureCommand?: LogGestureCommand;
  innertubeCommand?: AmbitiousInnertubeCommand;
}

export interface AmbitiousInnertubeCommand {
  clickTrackingParams: string;
  commandMetadata: ContinuationEndpointCommandMetadata;
  likeEndpoint: TentacledLikeEndpoint;
}

export interface TentacledLikeEndpoint {
  status: StatusEnum;
  target: TargetClass;
  likeParams: string;
}

export interface VisibleOnLoad {
  key: string;
}

export interface ViewCount {
  videoViewCountRenderer: VideoViewCountRenderer;
}

export interface VideoViewCountRenderer {
  viewCount: ViewsClass;
  isLive?: boolean;
  originalViewCount: string;
  shortViewCount?: LiveIndicatorText;
}

export interface VideoSecondaryInfoRenderer {
  owner: Owner;
  subscribeButton: VideoSecondaryInfoRendererSubscribeButton;
  metadataRowContainer: MetadataRowContainer;
  showMoreText: LiveIndicatorText;
  showLessText: LiveIndicatorText;
  trackingParams: string;
  defaultExpanded: boolean;
  descriptionCollapsedLines: number;
  showMoreCommand: ShowMoreCommand;
  showLessCommand: ShowLessCommandElement;
  attributedDescription: AttributedDescription;
  headerRuns: HeaderRun[];
}

export interface AttributedDescription {
  content: string;
  commandRuns: AttributedDescriptionCommandRun[];
  styleRuns: AttributedDescriptionStyleRun[];
  attachmentRuns?: AttributedDescriptionAttachmentRun[];
  decorationRuns?: DecorationRun[];
  paragraphStyleRuns?: ParagraphStyleRun[];
}

export interface AttributedDescriptionAttachmentRun {
  startIndex: number;
  length: number;
  element: FluffyElement;
  alignment: Alignment;
}

export interface FluffyElement {
  type: PurpleType;
  properties: FluffyProperties;
}

export interface FluffyProperties {
  layoutProperties: FluffyLayoutProperties;
}

export interface FluffyLayoutProperties {
  height: Height;
  width: Height;
  margin: FluffyMargin;
}

export interface FluffyMargin {
  top: Height;
}

export interface AttributedDescriptionCommandRun {
  startIndex: number;
  length: number;
  onTap: CunningOnTap;
  onTapOptions?: OnTapOptions;
  loggingDirectives?: InfoCardIconRenderer;
}

export interface InfoCardIconRenderer {
  trackingParams: string;
}

export interface CunningOnTap {
  innertubeCommand: CunningInnertubeCommand;
}

export interface CunningInnertubeCommand {
  clickTrackingParams: string;
  commandMetadata: ChannelNavigationEndpointCommandMetadata;
  urlEndpoint?: PurpleURLEndpoint;
  browseEndpoint?: CommandBrowseEndpoint;
  watchEndpoint?: PurpleWatchEndpoint;
}

export interface PurpleURLEndpoint {
  url: string;
  target: TargetEnum;
  nofollow: boolean;
}

export interface OnTapOptions {
  accessibilityInfo: AccessibilityInfo;
}

export interface AccessibilityInfo {
  accessibilityLabel: string;
}

export interface DecorationRun {
  textDecorator: TextDecorator;
}

export interface TextDecorator {
  highlightTextDecorator: HighlightTextDecorator;
}

export interface HighlightTextDecorator {
  startIndex: number;
  length: number;
  backgroundCornerRadius: number;
  bottomPadding: number;
  highlightTextDecoratorExtensions: HighlightTextDecoratorExtensions;
}

export interface HighlightTextDecoratorExtensions {
  highlightTextDecoratorColorMapExtension: ColorMapExtension;
}

export interface ColorMapExtension {
  colorMap: ColorMap[];
}

export interface ColorMap {
  key: Key;
  value: number;
}

export type Key = "USER_INTERFACE_THEME_DARK" | "USER_INTERFACE_THEME_LIGHT";

export interface ParagraphStyleRun {
  startIndex?: number;
  length: number;
  listGroup?: ListGroup;
}

export interface ListGroup {
  listType: ListItemListType;
  listItems: ListGroupListItem[];
}

export interface ListGroupListItem {
  listType: ListItemListType;
  startIndex: number;
  length: number;
}

export type ListItemListType = "LIST_TYPE_BULLET";

export interface AttributedDescriptionStyleRun {
  startIndex: number;
  length: number;
  styleRunExtensions: StyleRunExtensions;
  fontFamilyName?: FontFamilyName;
}

export type FontFamilyName = "Roboto";

export interface StyleRunExtensions {
  styleRunColorMapExtension: ColorMapExtension;
}

export interface HeaderRun {
  startIndex: number;
  length: number;
  headerMapping: HeaderMapping;
}

export type HeaderMapping = "ATTRIBUTED_STRING_HEADER_MAPPING_UNSPECIFIED";

export interface MetadataRowContainer {
  metadataRowContainerRenderer: MetadataRowContainerRenderer;
}

export interface MetadataRowContainerRenderer {
  collapsedItemCount: number;
  trackingParams: string;
}

export interface Owner {
  videoOwnerRenderer: VideoOwnerRenderer;
}

export interface VideoOwnerRenderer {
  thumbnail: BackgroundClass;
  title: Byline;
  subscriptionButton: SubscriptionButton;
  navigationEndpoint: ChannelNavigationEndpointClass;
  subscriberCountText: ShortViewCountText;
  trackingParams: string;
  badges?: VideoOwnerRendererBadge[];
  membershipButton?: MembershipButton;
}

export interface VideoOwnerRendererBadge {
  metadataBadgeRenderer: MetadataBadgeRenderer;
}

export interface MetadataBadgeRenderer {
  icon: Icon;
  style: string;
  tooltip: string;
  trackingParams: string;
  accessibilityData: AccessibilityData;
}

export interface MembershipButton {
  timedAnimationButtonRenderer: TimedAnimationButtonRenderer;
}

export interface TimedAnimationButtonRenderer {
  buttonRenderer: A11YSkipNavigationButton;
}

export interface A11YSkipNavigationButton {
  buttonRenderer: A11YSkipNavigationButtonButtonRenderer;
}

export interface A11YSkipNavigationButtonButtonRenderer {
  style: StyleTypeEnum;
  size: DownloadButtonRendererSize;
  isDisabled: boolean;
  text: Subtitle;
  serviceEndpoint?: StickyServiceEndpoint;
  trackingParams: string;
  accessibilityData?: DisabledAccessibilityData;
  targetId?: string;
  command?: OnResponseReceivedEndpoint;
}

export interface OnResponseReceivedEndpoint {
  clickTrackingParams: string;
  commandMetadata?: OnResponseReceivedEndpointCommandMetadata;
  signalServiceEndpoint?: CommandSignalServiceEndpoint;
  loadMarkersCommand?: LoadMarkersCommand;
}

export interface OnResponseReceivedEndpointCommandMetadata {
  webCommandMetadata: IndecentWebCommandMetadata;
}

export interface IndecentWebCommandMetadata {
  sendPost: boolean;
}

export interface LoadMarkersCommand {
  visibleOnLoadKeys?: string[];
  entityKeys?: string[];
}

export interface StickyServiceEndpoint {
  clickTrackingParams: string;
  commandMetadata: ContinuationEndpointCommandMetadata;
  ypcGetOffersEndpoint: YpcGetOffersEndpoint;
}

export interface ChannelNavigationEndpointClass {
  clickTrackingParams: string;
  commandMetadata: ChannelNavigationEndpointCommandMetadata;
  browseEndpoint: ChannelNavigationEndpointBrowseEndpoint;
}

export interface ChannelNavigationEndpointBrowseEndpoint {
  browseId: string;
  canonicalBaseUrl?: string;
}

export interface SubscriptionButton {
  type: string;
  subscribed?: boolean;
}

export interface Byline {
  runs: BylineRun[];
}

export interface BylineRun {
  text: string;
  navigationEndpoint: ChannelNavigationEndpointClass;
}

export interface ShowMoreCommand {
  clickTrackingParams: string;
  commandExecutorCommand: ShowMoreCommandCommandExecutorCommand;
}

export interface ShowMoreCommandCommandExecutorCommand {
  commands: FriskyCommand[];
}

export interface FriskyCommand {
  clickTrackingParams: string;
  changeEngagementPanelVisibilityAction?: ChangeEngagementPanelVisibilityAction;
  scrollToEngagementPanelCommand?: ScrollToEngagementPanelCommandClass;
}

export interface VideoSecondaryInfoRendererSubscribeButton {
  subscribeButtonRenderer: PurpleSubscribeButtonRenderer;
}

export interface PurpleSubscribeButtonRenderer {
  buttonText: Subtitle;
  subscribed: boolean;
  enabled: boolean;
  type: string;
  channelId: ID;
  showPreferences: boolean;
  subscribedButtonText: Subtitle;
  unsubscribedButtonText: Subtitle;
  trackingParams: string;
  unsubscribeButtonText: Subtitle;
  subscribeAccessibility: DisabledAccessibilityData;
  unsubscribeAccessibility: DisabledAccessibilityData;
  notificationPreferenceButton: NotificationPreferenceButton;
  targetId: string;
  subscribedEntityKey: string;
  onSubscribeEndpoints: SubscribeCommand[];
  onUnsubscribeEndpoints: OnUnsubscribeEndpoint[];
}

export interface NotificationPreferenceButton {
  subscriptionNotificationToggleButtonRenderer: SubscriptionNotificationToggleButtonRenderer;
}

export interface SubscriptionNotificationToggleButtonRenderer {
  states: StateElement[];
  currentStateId: number;
  trackingParams: string;
  command: SubscriptionNotificationToggleButtonRendererCommand;
  targetId: string;
  secondaryIcon: Icon;
}

export interface SubscriptionNotificationToggleButtonRendererCommand {
  clickTrackingParams: string;
  commandExecutorCommand: TentacledCommandExecutorCommand;
}

export interface TentacledCommandExecutorCommand {
  commands: MischievousCommand[];
}

export interface MischievousCommand {
  clickTrackingParams: string;
  openPopupAction: FluffyOpenPopupAction;
}

export interface FluffyOpenPopupAction {
  popup: IndigoPopup;
  popupType: string;
}

export interface IndigoPopup {
  menuPopupRenderer: PurpleMenuPopupRenderer;
}

export interface PurpleMenuPopupRenderer {
  items: StickyItem[];
}

export interface StickyItem {
  menuServiceItemRenderer: TentacledMenuServiceItemRenderer;
}

export interface TentacledMenuServiceItemRenderer {
  text: ViewsClass;
  icon: Icon;
  serviceEndpoint: ServiceEndpointElement;
  trackingParams: string;
  isSelected?: boolean;
}

export interface ServiceEndpointElement {
  clickTrackingParams: string;
  commandMetadata: ContinuationEndpointCommandMetadata;
  modifyChannelNotificationPreferenceEndpoint?: YpcGetOffersEndpoint;
  signalServiceEndpoint?: OnUnsubscribeEndpointSignalServiceEndpoint;
  subscribeEndpoint?: SubscribeEndpoint;
}

export interface OnUnsubscribeEndpointSignalServiceEndpoint {
  signal: SignalServiceEndpointSignal;
  actions: IndecentAction[];
}

export interface IndecentAction {
  clickTrackingParams: string;
  openPopupAction: TentacledOpenPopupAction;
}

export interface TentacledOpenPopupAction {
  popup: IndecentPopup;
  popupType: PopupType;
}

export interface IndecentPopup {
  confirmDialogRenderer: FluffyConfirmDialogRenderer;
}

export interface FluffyConfirmDialogRenderer {
  trackingParams: string;
  dialogMessages: Subtitle[];
  confirmButton: SaveButtonClass;
  cancelButton: ConfirmDialogRendererCancelButton;
  primaryIsCancel: boolean;
}

export interface ConfirmDialogRendererCancelButton {
  buttonRenderer: TentacledButtonRenderer;
}

export interface TentacledButtonRenderer {
  style: StyleTypeEnum;
  size: DownloadButtonRendererSize;
  isDisabled: boolean;
  text: Subtitle;
  accessibility: AccessibilityData;
  trackingParams: string;
}

export interface SaveButtonClass {
  buttonRenderer: SaveButtonButtonRenderer;
}

export interface SaveButtonButtonRenderer {
  style: StyleTypeEnum;
  size: DownloadButtonRendererSize;
  isDisabled: boolean;
  text?: Subtitle;
  accessibility?: AccessibilityData;
  trackingParams: string;
  serviceEndpoint?: UnsubscribeCommand;
  command?: BraggadociousCommand;
  icon?: Icon;
  accessibilityData?: DisabledAccessibilityData;
}

export interface BraggadociousCommand {
  clickTrackingParams: string;
  commandMetadata?: ContinuationEndpointCommandMetadata;
  continuationCommand?: ContinuationEndpointContinuationCommand;
  openPopupAction?: OnClickCommandOpenPopupAction;
  createBackstagePostEndpoint?: CreateBackstagePostEndpoint;
  commandExecutorCommand?: StickyCommandExecutorCommand;
}

export interface StickyCommandExecutorCommand {
  commands: Command1[];
}

export interface Command1 {
  clickTrackingParams: string;
  showEngagementPanelEndpoint?: CommandShowEngagementPanelEndpoint;
  scrollToEngagementPanelCommand?: ScrollToEngagementPanelCommandClass;
}

export interface CommandShowEngagementPanelEndpoint {
  panelIdentifier: PanelIdentifier;
  sourcePanelIdentifier: string;
}

export interface CreateBackstagePostEndpoint {
  createBackstagePostParams: string;
}

export interface UnsubscribeCommand {
  clickTrackingParams: string;
  commandMetadata: ContinuationEndpointCommandMetadata;
  unsubscribeEndpoint: SubscribeEndpoint;
}

export interface SubscribeEndpoint {
  channelIds: ID[];
  params: string;
}

export interface StateElement {
  stateId: number;
  nextStateId: number;
  state: CancelButton;
}

export interface SubscribeCommand {
  clickTrackingParams: string;
  commandMetadata: ContinuationEndpointCommandMetadata;
  subscribeEndpoint: SubscribeEndpoint;
}

export interface OnUnsubscribeEndpoint {
  clickTrackingParams: string;
  commandMetadata: OnResponseReceivedEndpointCommandMetadata;
  signalServiceEndpoint: OnUnsubscribeEndpointSignalServiceEndpoint;
}

export interface TwoColumnWatchNextResultsSecondaryResults {
  secondaryResults: SecondaryResultsSecondaryResults;
}

export interface SecondaryResultsSecondaryResults {
  results: SecondaryResultsResult[];
  trackingParams: string;
}

export interface SecondaryResultsResult {
  relatedChipCloudRenderer?: RelatedChipCloudRenderer;
  itemSectionRenderer?: ResultItemSectionRenderer;
}

export interface ResultItemSectionRenderer {
  contents: HilariousContent[];
  trackingParams: string;
  sectionIdentifier: string;
  targetId: TargetID;
}

export interface HilariousContent {
  lockupViewModel?: LockupViewModel;
  continuationItemRenderer?: FluffyContinuationItemRenderer;
}

export interface FluffyContinuationItemRenderer {
  trigger: string;
  continuationEndpoint: PurpleContinuationEndpoint;
  button: SaveButtonClass;
}

export interface LockupViewModel {
  contentImage: ContentImage;
  metadata: LockupViewModelMetadata;
  contentId: string;
  contentType: ContentType;
  rendererContext: LockupViewModelRendererContext;
}

export interface ContentImage {
  thumbnailViewModel: ThumbnailViewModel;
}

export interface ThumbnailViewModel {
  image: LogoDarkClass;
  overlays: Overlay[];
}

export interface LogoDarkClass {
  sources: ThumbnailElement[];
}

export interface Overlay {
  thumbnailBottomOverlayViewModel?: ThumbnailBottomOverlayViewModel;
  animatedThumbnailOverlayViewModel?: AnimatedThumbnailOverlayViewModel;
  thumbnailHoverOverlayToggleActionsViewModel?: ThumbnailHoverOverlayToggleActionsViewModel;
  thumbnailOverlayBadgeViewModel?: ThumbnailOverlayBadgeViewModel;
}

export interface AnimatedThumbnailOverlayViewModel {
  thumbnail: LogoDarkClass;
}

export interface ThumbnailBottomOverlayViewModel {
  progressBar: ProgressBar;
  badges: ThumbnailBadgeElement[];
}

export interface ThumbnailBadgeElement {
  thumbnailBadgeViewModel: ThumbnailBadgeViewModel;
}

export interface ThumbnailBadgeViewModel {
  text: string;
  badgeStyle: ThumbnailBadgeViewModelBadgeStyle;
  animationActivationTargetId: string;
  animationActivationEntityKey: AnimationActivationEntityKey;
  lottieData: LottieData;
  animatedText: AnimatedText;
  animationActivationEntitySelectorType: AnimationActivationEntitySelectorType;
  rendererContext?: ThumbnailBadgeViewModelRendererContext;
  icon?: IconImage;
  inlinePlaybackBadgeData?: InlinePlaybackBadgeData;
}

export type AnimatedText = "Now playing";

export type AnimationActivationEntityKey =
  "Eh8veW91dHViZS9hcHAvd2F0Y2gvcGxheWVyX3N0YXRlIMMCKAE%3D";

export type AnimationActivationEntitySelectorType =
  "THUMBNAIL_BADGE_ANIMATION_ENTITY_SELECTOR_TYPE_PLAYER_STATE";

export type ThumbnailBadgeViewModelBadgeStyle =
  | "THUMBNAIL_OVERLAY_BADGE_STYLE_DEFAULT"
  | "THUMBNAIL_OVERLAY_BADGE_STYLE_LIVE";

export interface InlinePlaybackBadgeData {
  replicateAsTimestamp: boolean;
}

export interface LottieData {
  url: string;
  settings: Settings;
}

export interface Settings {
  loop: boolean;
  autoplay: boolean;
}

export interface ThumbnailBadgeViewModelRendererContext {
  accessibilityContext: AccessibilityData;
}

export interface ProgressBar {
  thumbnailOverlayProgressBarViewModel: ThumbnailOverlayProgressBarViewModel;
}

export interface ThumbnailOverlayProgressBarViewModel {
  startPercent: number;
}

export interface ThumbnailHoverOverlayToggleActionsViewModel {
  buttons: ThumbnailHoverOverlayToggleActionsViewModelButton[];
}

export interface ThumbnailHoverOverlayToggleActionsViewModelButton {
  toggleButtonViewModel: ButtonToggleButtonViewModel;
}

export interface ButtonToggleButtonViewModel {
  defaultButtonViewModel: MenuButton;
  toggledButtonViewModel: MenuButton;
  isToggled: boolean;
  trackingParams: string;
}

export interface ThumbnailOverlayBadgeViewModel {
  thumbnailBadges: ThumbnailBadgeElement[];
  position: ThumbnailOverlayBadgeViewModelPosition;
}

export type ThumbnailOverlayBadgeViewModelPosition =
  "THUMBNAIL_OVERLAY_BADGE_POSITION_BOTTOM_END";

export type ContentType = "LOCKUP_CONTENT_TYPE_VIDEO";

export interface LockupViewModelMetadata {
  lockupMetadataViewModel: LockupMetadataViewModel;
}

export interface LockupMetadataViewModel {
  title: BodyText;
  image: LockupMetadataViewModelImage;
  metadata: LockupMetadataViewModelMetadata;
  menuButton: MenuButton;
}

export interface LockupMetadataViewModelImage {
  decoratedAvatarViewModel: DecoratedAvatarViewModel;
}

export interface DecoratedAvatarViewModel {
  avatar: DecoratedAvatarViewModelAvatar;
  a11yLabel: string;
  rendererContext: DecoratedAvatarViewModelRendererContext;
}

export interface DecoratedAvatarViewModelAvatar {
  avatarViewModel: AvatarAvatarViewModel;
}

export interface AvatarAvatarViewModel {
  image: LogoDarkClass;
  avatarImageSize: AvatarImageSize;
}

export type AvatarImageSize = "AVATAR_SIZE_M";

export interface DecoratedAvatarViewModelRendererContext {
  commandContext: TentacledCommandContext;
}

export interface TentacledCommandContext {
  onTap: MagentaOnTap;
}

export interface MagentaOnTap {
  innertubeCommand: ChannelNavigationEndpointClass;
}

export interface LockupMetadataViewModelMetadata {
  contentMetadataViewModel: ContentMetadataViewModel;
}

export interface ContentMetadataViewModel {
  metadataRows: MetadataRow[];
  delimiter: Delimiter;
}

export type Delimiter = " • ";

export interface MetadataRow {
  metadataParts?: MetadataPart[];
  badges?: MetadataRowBadge[];
}

export interface MetadataRowBadge {
  badgeViewModel: BadgeViewModel;
}

export interface BadgeViewModel {
  badgeText: BadgeText;
  badgeStyle: BadgeViewModelBadgeStyle;
  trackingParams: string;
}

export type BadgeViewModelBadgeStyle = "BADGE_DEFAULT";

export type BadgeText = "New";

export interface MetadataPart {
  text: MetadataPartText;
}

export interface MetadataPartText {
  content: string;
  styleRuns?: TextStyleRun[];
  attachmentRuns?: TextAttachmentRun[];
}

export interface TextAttachmentRun {
  startIndex: number;
  length: number;
  element: TentacledElement;
  alignment: Alignment;
}

export interface TentacledElement {
  type: FluffyType;
  properties: TentacledProperties;
}

export interface TentacledProperties {
  layoutProperties: TentacledLayoutProperties;
}

export interface TentacledLayoutProperties {
  height: Height;
  width: Height;
  margin: TentacledMargin;
}

export interface TentacledMargin {
  left: Height;
}

export interface FluffyType {
  imageType: FluffyImageType;
}

export interface FluffyImageType {
  image: PurpleImage;
}

export interface PurpleImage {
  sources: ImageSource[];
}

export interface ImageSource {
  clientResource: ClientResource;
  width: number;
  height: number;
}

export interface TextStyleRun {
  startIndex: number;
  styleRunExtensions: StyleRunExtensions;
}

export interface LockupViewModelRendererContext {
  loggingContext: PurpleLoggingContext;
  accessibilityContext: AccessibilityData;
  commandContext: StickyCommandContext;
}

export interface StickyCommandContext {
  onTap: FriskyOnTap;
}

export interface FriskyOnTap {
  innertubeCommand: MagentaInnertubeCommand;
}

export interface MagentaInnertubeCommand {
  clickTrackingParams: string;
  commandMetadata: AutoplayVideoCommandMetadata;
  watchEndpoint: FluffyWatchEndpoint;
}

export interface FluffyWatchEndpoint {
  videoId: string;
  params?: string;
  startTimeSeconds?: number;
  playerParams?: TentacledPlayerParams;
  nofollow: boolean;
  ustreamerConfig?: UstreamerConfig;
  watchEndpointSupportedOnesieConfig: WatchEndpointSupportedOnesieConfig;
}

export type TentacledPlayerParams =
  | "ugUEEgJlbg%3D%3D"
  | "0gcJCU0KAYcqIYzv"
  | "ugUHEgVlbi1VUw%3D%3D";

export interface RelatedChipCloudRenderer {
  content: RelatedChipCloudRendererContent;
  showProminentChips: boolean;
}

export interface RelatedChipCloudRendererContent {
  chipCloudRenderer: ChipCloudRenderer;
}

export interface ChipCloudRenderer {
  chips: ChipCloudRendererChip[];
  trackingParams: string;
  horizontalScrollable: boolean;
  nextButton: CloseButtonClass;
  previousButton: CloseButtonClass;
  style: ChipCloudRendererStyle;
}

export interface ChipCloudRendererChip {
  chipCloudChipRenderer: ChipCloudChipRenderer;
}

export interface ChipCloudChipRenderer {
  style: ChipCloudChipRendererStyle;
  text: LiveIndicatorText;
  navigationEndpoint: Endpoint;
  trackingParams: string;
  isSelected: boolean;
}

export interface ChipCloudChipRendererStyle {
  styleType: StyleTypeEnum;
}

export interface CloseButtonClass {
  buttonRenderer: CloseButtonButtonRenderer;
}

export interface CloseButtonButtonRenderer {
  style: StyleTypeEnum;
  size: DownloadButtonRendererSize;
  isDisabled: boolean;
  icon: Icon;
  accessibility: AccessibilityData;
  trackingParams: string;
}

export interface ChipCloudRendererStyle {
  backgroundStyle: string;
}

export interface CurrentVideoEndpoint {
  clickTrackingParams: string;
  commandMetadata: AutoplayVideoCommandMetadata;
  watchEndpoint: CurrentVideoEndpointWatchEndpoint;
}

export interface CurrentVideoEndpointWatchEndpoint {
  videoId: string;
  watchEndpointSupportedOnesieConfig: WatchEndpointSupportedOnesieConfig;
}

export interface EngagementPanelElement {
  engagementPanelSectionListRenderer: FluffyEngagementPanelSectionListRenderer;
}

export interface FluffyEngagementPanelSectionListRenderer {
  content?: AmbitiousContent;
  targetId?: PanelIdentifier;
  visibility: VisibilityEnum;
  loggingDirectives: RunLoggingDirectives;
  onShowCommands?: FluffyOnShowCommand[];
  identifier?: Identifier;
  panelIdentifier?: PanelIdentifier;
  header?: FluffyHeader;
  veType?: number;
  resizability?: string;
  onCloseCommand?: FluffyOnCloseCommand;
}

export interface AmbitiousContent {
  adsEngagementPanelContentRenderer?: AdsEngagementPanelContentRenderer;
  sectionListRenderer?: FluffySectionListRenderer;
  structuredDescriptionContentRenderer?: StructuredDescriptionContentRenderer;
  clipSectionRenderer?: ClipSectionRenderer;
  productListRenderer?: ProductListRenderer;
  continuationItemRenderer?: TentacledContinuationItemRenderer;
}

export interface ClipSectionRenderer {
  contents: ClipSectionRendererContent[];
}

export interface ClipSectionRendererContent {
  clipCreationRenderer: ClipCreationRenderer;
}

export interface ClipCreationRenderer {
  trackingParams: string;
  userAvatar: BackgroundClass;
  titleInput: TitleInput;
  scrubber: Scrubber;
  saveButton: SaveButtonClass;
  displayName: LiveIndicatorText;
  publicityLabel: string;
  cancelButton: SaveButtonClass;
  adStateOverlay: AdStateOverlay;
  externalVideoId: ExternalVideoIDEnum;
  publicityLabelIcon: string;
}

export interface AdStateOverlay {
  clipAdStateRenderer: ClipAdStateRenderer;
}

export interface ClipAdStateRenderer {
  title: Subtitle;
  body: Subtitle;
}

export interface Scrubber {
  clipCreationScrubberRenderer: ClipCreationScrubberRenderer;
}

export interface ClipCreationScrubberRenderer {
  lengthTemplate: string;
  maxLengthMs: number;
  minLengthMs: number;
  defaultLengthMs: number;
  windowSizeMs: number;
  startAccessibility: DisabledAccessibilityData;
  endAccessibility: DisabledAccessibilityData;
  durationAccessibility: DisabledAccessibilityData;
}

export interface TitleInput {
  clipCreationTextInputRenderer: ClipCreationTextInputRenderer;
}

export interface ClipCreationTextInputRenderer {
  placeholderText: Subtitle;
  maxCharacterLimit: number;
}

export interface TentacledContinuationItemRenderer {
  trigger: string;
  continuationEndpoint: FluffyContinuationEndpoint;
}

export interface FluffyContinuationEndpoint {
  clickTrackingParams: string;
  commandMetadata: ContinuationEndpointCommandMetadata;
  getTranscriptEndpoint: YpcGetOffersEndpoint;
}

export interface ProductListRenderer {
  contents: ProductListRendererContent[];
  trackingParams: string;
}

export interface ProductListRendererContent {
  productListHeaderRenderer?: ProductListHeaderRenderer;
  productListItemRenderer?: ProductListItemRenderer;
}

export interface ProductListHeaderRenderer {
  title: ProductListHeaderRendererTitle;
  trackingParams: string;
  suppressPaddingDisclaimer: boolean;
}

export interface ProductListHeaderRendererTitle {
  runs: FluffyRun[];
}

export interface FluffyRun {
  text: string;
  navigationEndpoint?: FluffyNavigationEndpoint;
}

export interface FluffyNavigationEndpoint {
  clickTrackingParams: string;
  commandMetadata: StickyCommandMetadata;
  openPopupAction: StickyOpenPopupAction;
}

export interface StickyCommandMetadata {
  webCommandMetadata: CommonConfig;
}

export interface StickyOpenPopupAction {
  popup: HilariousPopup;
  popupType: string;
}

export interface HilariousPopup {
  menuPopupRenderer: FluffyMenuPopupRenderer;
}

export interface FluffyMenuPopupRenderer {
  items: FluffyItem[];
  menuPopupAccessibility: AccessibilityData;
}

export interface ProductListItemRenderer {
  title: LiveIndicatorText;
  accessibilityTitle: string;
  thumbnail: BackgroundClass;
  price: string;
  onClickCommand: OnClickCommandClass;
  trackingParams: string;
  merchantName: MerchantNameEnum;
  stayInApp: boolean;
  viewButton: ViewButton;
  loggingDirectives: MenuServiceItemRendererLoggingDirectives;
}

export interface ViewButton {
  buttonRenderer: ViewButtonButtonRenderer;
}

export interface ViewButtonButtonRenderer {
  style: StyleTypeEnum;
  size: PurpleSize;
  text: LiveIndicatorText;
  icon: Icon;
  trackingParams: string;
  iconPosition: IconPosition;
}

export type IconPosition = "BUTTON_ICON_POSITION_TYPE_RIGHT_OF_TEXT";

export type PurpleSize = "SIZE_SMALL";

export interface FluffySectionListRenderer {
  trackingParams: string;
  hack?: boolean;
  contents?: CunningContent[];
}

export interface CunningContent {
  itemSectionRenderer: TentacledItemSectionRenderer;
}

export interface TentacledItemSectionRenderer {
  contents: MagentaContent[];
  trackingParams: string;
  sectionIdentifier: string;
  targetId: PanelIdentifier;
}

export interface MagentaContent {
  continuationItemRenderer: PurpleContinuationItemRenderer;
}

export interface StructuredDescriptionContentRenderer {
  items: StructuredDescriptionContentRendererItem[];
}

export interface StructuredDescriptionContentRendererItem {
  videoDescriptionHeaderRenderer?: VideoDescriptionHeaderRenderer;
  expandableVideoDescriptionBodyRenderer?: ExpandableVideoDescriptionBodyRenderer;
  videoDescriptionInfocardsSectionRenderer?: VideoDescriptionInfocardsSectionRenderer;
  videoDescriptionGamingSectionRenderer?: VideoDescriptionGamingSectionRenderer;
  videoDescriptionTranscriptSectionRenderer?: VideoDescriptionTranscriptSectionRenderer;
  horizontalCardListRenderer?: HorizontalCardListRenderer;
}

export interface ExpandableVideoDescriptionBodyRenderer {
  showMoreText: ShortViewCountText;
  showLessText: LiveIndicatorText;
  attributedDescriptionBodyText: AttributedDescription;
  headerRuns: HeaderRun[];
  backgroundColorStyle: string;
  lightThemeColorPalette: ThemeColorPalette;
  darkThemeColorPalette: ThemeColorPalette;
  colorSampledDescriptionBodyText: AttributedDescription;
  enableColorSampledDescriptionBodyText: boolean;
}

export interface ThemeColorPalette {
  baseBackground: number;
  raisedBackground: number;
  additiveBackground: number;
  textPrimary: number;
  textSecondary: number;
  invertedBackground: number;
  overlayBackground: number;
}

export interface HorizontalCardListRenderer {
  cards: HorizontalCardListRendererCard[];
  trackingParams: string;
  header: HorizontalCardListRendererHeader;
  style: HorizontalCardListRendererStyle;
  footerButton: FooterButton;
}

export interface HorizontalCardListRendererCard {
  videoAttributeViewModel: VideoAttributeViewModel;
}

export interface VideoAttributeViewModel {
  image: VideoAttributeViewModelImage;
  imageStyle: string;
  title: string;
  subtitle: string;
  secondarySubtitle: BodyText;
  orientation: string;
  onTap: VideoAttributeViewModelOnTap;
  sizingRule: string;
  overflowMenuOnTap: OverflowMenuOnTap;
  overflowMenuA11yLabel: OverflowMenuA11YLabel;
  loggingDirectives: RunLoggingDirectives;
}

export interface VideoAttributeViewModelOnTap {
  innertubeCommand: CurrentVideoEndpoint;
}

export interface OverflowMenuOnTap {
  innertubeCommand: OverflowMenuOnTapInnertubeCommand;
}

export interface OverflowMenuOnTapInnertubeCommand {
  clickTrackingParams: string;
  commandMetadata: IndigoCommandMetadata;
  confirmDialogEndpoint: ConfirmDialogEndpoint;
}

export interface IndigoCommandMetadata {
  webCommandMetadata: TentacledWebCommandMetadata;
}

export interface ConfirmDialogEndpoint {
  content: ConfirmDialogEndpointContent;
}

export interface ConfirmDialogEndpointContent {
  confirmDialogRenderer: ContentConfirmDialogRenderer;
}

export interface ContentConfirmDialogRenderer {
  title: Subtitle;
  trackingParams: string;
  dialogMessages: DialogMessageElement[];
  confirmButton: A11YSkipNavigationButton;
  primaryIsCancel: boolean;
}

export interface DialogMessageElement {
  runs: TentacledRun[];
}

export interface TentacledRun {
  text: string;
  bold?: boolean;
}

export interface FooterButton {
  buttonViewModel: FooterButtonButtonViewModel;
}

export interface FooterButtonButtonViewModel {
  iconName: IconNameEnum;
  onTap: MischievousOnTap;
  style: FluffyStyle;
  trackingParams: string;
  type: string;
  buttonSize: PrimaryButtonButtonSize;
  titleFormatted: BodyText;
}

export interface MischievousOnTap {
  innertubeCommand: InnertubeCommandClass;
}

export interface InnertubeCommandClass {
  clickTrackingParams: string;
  commandMetadata: ChannelNavigationEndpointCommandMetadata;
  browseEndpoint: EndpointBrowseEndpoint;
}

export interface EndpointBrowseEndpoint {
  browseId: string;
}

export interface HorizontalCardListRendererHeader {
  richListHeaderRenderer: RichListHeaderRenderer;
}

export interface RichListHeaderRenderer {
  title: LiveIndicatorText;
  subtitle: LiveIndicatorText;
  trackingParams: string;
}

export interface HorizontalCardListRendererStyle {
  type: string;
}

export interface VideoDescriptionGamingSectionRenderer {
  sectionTitle: Subtitle;
  mediaLockups: MediaLockup[];
  topicLink: TopicLink;
}

export interface MediaLockup {
  mediaLockupRenderer: MediaLockupRenderer;
}

export interface MediaLockupRenderer {
  title: LiveIndicatorText;
  subtitle: LiveIndicatorText;
  thumbnailDetails: BackgroundClass;
  endpoint: InnertubeCommandClass;
  trackingParams: string;
}

export interface TopicLink {
  topicLinkRenderer: TopicLinkRenderer;
}

export interface TopicLinkRenderer {
  title: Subtitle;
  thumbnailDetails: ChannelThumbnail;
  endpoint: InnertubeCommandClass;
  callToActionIcon: Icon;
  trackingParams: string;
}

export interface ChannelThumbnail {
  thumbnails: CommonConfig[];
}

export interface VideoDescriptionHeaderRenderer {
  title: SuperTitleLink;
  channel: LiveIndicatorText;
  views: ViewsClass;
  publishDate: LiveIndicatorText;
  channelNavigationEndpoint: ChannelNavigationEndpointClass;
  channelThumbnail: ChannelThumbnail;
  factoid?: FactoidElement[];
}

export interface FactoidElement {
  factoidRenderer?: FactoidRenderer;
  viewCountFactoidRenderer?: ViewCountFactoidRenderer;
}

export interface FactoidRenderer {
  value: LiveIndicatorText;
  label: LiveIndicatorText;
  accessibilityText: string;
  backgroundColorStyle: string;
  lightThemeColorPalette: ThemeColorPalette;
  darkThemeColorPalette: ThemeColorPalette;
  enableColorSampledText: boolean;
  position?: string;
}

export interface ViewCountFactoidRenderer {
  viewCountEntityKey: string;
  factoid: ViewCountFactoidRendererFactoid;
  viewCountType: string;
}

export interface ViewCountFactoidRendererFactoid {
  factoidRenderer: FactoidRenderer;
}

export interface VideoDescriptionInfocardsSectionRenderer {
  sectionTitle: LiveIndicatorText;
  creatorVideosButton: CreatorButton;
  creatorAboutButton: CreatorButton;
  sectionSubtitle: ShortViewCountText;
  channelAvatar: ChannelThumbnail;
  channelEndpoint: ChannelNavigationEndpointClass;
  creatorCustomUrlButtons?: CreatorCustomURLButton[];
  trackingParams: string;
}

export interface CreatorButton {
  buttonRenderer: CreatorAboutButtonButtonRenderer;
}

export interface CreatorAboutButtonButtonRenderer {
  style: string;
  size: DownloadButtonRendererSize;
  isDisabled: boolean;
  text: LiveIndicatorText;
  icon: Icon;
  trackingParams: string;
  command: CommandClass;
}

export interface CreatorCustomURLButton {
  buttonViewModel: CreatorCustomURLButtonButtonViewModel;
}

export interface CreatorCustomURLButtonButtonViewModel {
  title: string;
  onTap: InteractionOnTap;
  style: string;
  trackingParams: string;
  type: string;
  buttonSize: PrimaryButtonButtonSize;
  iconImage: ThumbnailElement;
}

export interface VideoDescriptionTranscriptSectionRenderer {
  sectionTitle: Subtitle;
  subHeaderText: Subtitle;
  primaryButton: SaveButtonClass;
  trackingParams: string;
}

export interface FluffyHeader {
  engagementPanelTitleHeaderRenderer: FluffyEngagementPanelTitleHeaderRenderer;
}

export interface FluffyEngagementPanelTitleHeaderRenderer {
  title: ShortViewCountTextClass;
  visibilityButton: CancelButton;
  trackingParams: string;
  informationButton?: CancelButton;
  contextualInfo?: Subtitle;
  menu?: EngagementPanelTitleHeaderRendererMenu;
  subheader?: Subheader;
}

export interface EngagementPanelTitleHeaderRendererMenu {
  sortFilterSubMenuRenderer?: MenuSortFilterSubMenuRenderer;
  menuRenderer?: MenuMenuRenderer;
}

export interface MenuMenuRenderer {
  items: IndigoItem[];
  trackingParams: string;
  accessibility: DisabledAccessibilityData;
}

export interface IndigoItem {
  menuServiceItemRenderer: StickyMenuServiceItemRenderer;
}

export interface StickyMenuServiceItemRenderer {
  text: Subtitle;
  serviceEndpoint: OnResponseReceivedEndpoint;
  trackingParams: string;
}

export interface MenuSortFilterSubMenuRenderer {
  subMenuItems: SubMenuItem[];
  icon: Icon;
  accessibility: DisabledAccessibilityData;
  trackingParams: string;
}

export interface Subheader {
  chipBarViewModel: ChipBarViewModel;
}

export interface ChipBarViewModel {
  chips: ChipBarViewModelChip[];
  chipBarStateEntityKey: string;
}

export interface ChipBarViewModelChip {
  chipViewModel: ChipViewModel;
}

export interface ChipViewModel {
  text: string;
  selected: boolean;
  displayType: string;
  tapCommand: TapCommand;
  accessibilityLabel: string;
  loggingDirectives: RunLoggingDirectives;
}

export interface TapCommand {
  innertubeCommand: TapCommandInnertubeCommand;
}

export interface TapCommandInnertubeCommand {
  clickTrackingParams: string;
  commandExecutorCommand: InnertubeCommandCommandExecutorCommand;
}

export interface InnertubeCommandCommandExecutorCommand {
  commands: Command2[];
}

export interface Command2 {
  clickTrackingParams: string;
  updateEngagementPanelContentCommand?: UpdateEngagementPanelContentCommand;
  updateTimedMarkersSyncObserverCommand?: UpdateTimedMarkersSyncObserverCommand;
}

export interface UpdateEngagementPanelContentCommand {
  targetPanelIdentifier: Identifier;
  contentSourcePanelIdentifier: Identifier;
}

export interface Identifier {
  surface?: string;
  tag: Tag;
}

export type Tag =
  | "engagement-panel-searchable-transcript"
  | "engagement-panel-timeline-view-consolidated"
  | "PAsearch_preview";

export interface FluffyOnCloseCommand {
  clickTrackingParams: string;
  commandExecutorCommand: OnCloseCommandCommandExecutorCommand;
}

export interface OnCloseCommandCommandExecutorCommand {
  commands: Command3[];
}

export interface Command3 {
  clickTrackingParams: string;
  updateTimedMarkersSyncObserverCommand: UpdateTimedMarkersSyncObserverCommand;
}

export interface FluffyOnShowCommand {
  clickTrackingParams: string;
  scrollToEngagementPanelCommand?: ScrollToEngagementPanelCommand;
  changeEngagementPanelVisibilityAction?: ChangeEngagementPanelVisibilityAction;
  showEngagementPanelScrimAction?: ShowEngagementPanelScrimAction;
}

export interface ScrollToEngagementPanelCommand {
  targetId?: PanelIdentifier;
  panelIdentifier?: GutParams;
}

export interface ShowEngagementPanelScrimAction {
  engagementPanelTargetId: PanelIdentifier;
  onClickCommands: OnClickCommand[];
}

export interface OnClickCommand {
  clickTrackingParams: string;
  openPopupAction: OnClickCommandOpenPopupAction;
}

export interface InitialDataFrameworkUpdates {
  entityBatchUpdate: PurpleEntityBatchUpdate;
}

export interface PurpleEntityBatchUpdate {
  mutations: PurpleMutation[];
  timestamp: Timestamp;
}

export interface PurpleMutation {
  entityKey: string;
  type: MutationType;
  options?: Options;
  payload?: PurplePayload;
}

export interface Options {
  persistenceOption: string;
}

export interface PurplePayload {
  likeStatusEntity?: LikeStatusEntity;
  subscriptionStateEntity?: SubscriptionStateEntity;
  videoActionButtonEnablementEntity?: VideoActionButtonEnablementEntity;
  macroMarkersListEntity?: MacroMarkersListEntity;
}

export interface MacroMarkersListEntity {
  key: string;
  externalVideoId: ExternalVideoIDEnum;
  markersList: MarkersList;
}

export interface MarkersList {
  markerType: string;
  markers: Marker[];
  markersMetadata: MarkersMetadata;
  markersDecoration: MarkersDecoration;
}

export interface Marker {
  startMillis: string;
  durationMillis: string;
  intensityScoreNormalized: number;
}

export interface MarkersDecoration {
  timedMarkerDecorations: TimedMarkerDecoration[];
}

export interface TimedMarkerDecoration {
  visibleTimeRangeStartMillis: number;
  visibleTimeRangeEndMillis: number;
  decorationTimeMillis: number;
  label: Subtitle;
  icon: string;
}

export interface MarkersMetadata {
  heatmapMetadata: HeatmapMetadata;
}

export interface HeatmapMetadata {
  maxHeightDp: number;
  minHeightDp: number;
  showHideAnimationDurationMillis: number;
}

export interface SubscriptionStateEntity {
  key: string;
  subscribed: boolean;
}

export interface VideoActionButtonEnablementEntity {
  videoActionButtonEnablementEntityKey: string;
  enabled: boolean;
}

export type MutationType =
  | "ENTITY_MUTATION_TYPE_DELETE"
  | "ENTITY_MUTATION_TYPE_REPLACE";

export interface Timestamp {
  seconds: string;
  nanos: number;
}

export interface InitialDataMicroformat {
  microformatDataRenderer: MicroformatDataRenderer;
}

export interface MicroformatDataRenderer {
  videoDetails: MicroformatDataRendererVideoDetails;
}

export interface MicroformatDataRendererVideoDetails {
  comments: Comment[];
}

export interface Comment {
  type: string;
  dateCreated: Date;
  text: string;
  author: Author;
  upvoteCount: number;
}

export interface Author {
  type: string;
  name: string;
  url: string;
  alternateName: string;
}

export interface PageVisualEffect {
  cinematicContainerRenderer: CinematicContainerRenderer;
}

export interface CinematicContainerRenderer {
  gradientColorConfig: GradientColorConfig[];
  presentationStyle: string;
  config: CinematicContainerRendererConfig;
}

export interface CinematicContainerRendererConfig {
  lightThemeBackgroundColor: number;
  darkThemeBackgroundColor: number;
  animationConfig: AnimationConfig;
  colorSourceSizeMultiplier: number;
  applyClientImageBlur: boolean;
  bottomColorSourceHeightMultiplier: number;
  maxBottomColorSourceHeight: number;
  colorSourceWidthMultiplier: number;
  colorSourceHeightMultiplier: number;
  blurStrength: number;
  watchFullscreenConfig: WatchFullscreenConfig;
  enableInLightTheme: boolean;
}

export interface AnimationConfig {
  crossfadeStartOffset: number;
  maxFrameRate: number;
  minImageUpdateIntervalMs?: number;
  crossfadeDurationMs?: number;
}

export interface WatchFullscreenConfig {
  colorSourceWidthMultiplier: number;
  colorSourceHeightMultiplier: number;
  scrimWidthMultiplier: number;
  scrimHeightMultiplier: number;
  scrimGradientConfig?: ScrimGradientConfig;
  flatScrimColor?: number;
}

export interface ScrimGradientConfig {
  gradientType: string;
  gradientColors: GradientColor[];
  gradientStartPointX: number;
  gradientStartPointY: number;
  gradientEndPointX: number;
  gradientEndPointY: number;
}

export interface GradientColor {
  lightThemeColor: number;
  darkThemeColor: number;
  startLocation: number;
}

export interface GradientColorConfig {
  darkThemeColor: number;
  startLocation?: number;
}

export interface PlayerOverlays {
  playerOverlayRenderer: PlayerOverlayRenderer;
}

export interface PlayerOverlayRenderer {
  endScreen: EndScreen;
  autoplay: PlayerOverlayRendererAutoplay;
  shareButton: ShareButtonClass;
  addToMenu: AddToMenu;
  videoDetails: PlayerOverlayRendererVideoDetails;
  liveIndicatorText?: LiveIndicatorText;
  autonavToggle: AutonavToggle;
  decoratedPlayerBarRenderer: PlayerOverlayRendererDecoratedPlayerBarRenderer;
  fullscreenQuickActionsBar: FullscreenQuickActionsBar;
  speedmasterUserEdu: SpeedmasterUserEdu;
  showPlaybackRateUpsellPanelCommand: ShowPlaybackRateUpsellPanelCommand;
}

export interface AddToMenu {
  menuRenderer: AddToMenuMenuRenderer;
}

export interface AddToMenuMenuRenderer {
  items: IndecentItem[];
  trackingParams: string;
}

export interface IndecentItem {
  menuServiceItemRenderer?: MenuItemRenderer;
  menuNavigationItemRenderer?: MenuItemRenderer;
}

export interface AutonavToggle {
  autoplaySwitchButtonRenderer: AutoplaySwitchButtonRenderer;
}

export interface AutoplaySwitchButtonRenderer {
  onEnabledCommand: OnAbledCommand;
  onDisabledCommand: OnAbledCommand;
  enabledAccessibilityData: DisabledAccessibilityData;
  disabledAccessibilityData: DisabledAccessibilityData;
  trackingParams: string;
  enabled: boolean;
}

export interface OnAbledCommand {
  clickTrackingParams: string;
  commandMetadata: ContinuationEndpointCommandMetadata;
  setSettingEndpoint: SetSettingEndpoint;
}

export interface SetSettingEndpoint {
  settingItemId: string;
  boolValue: boolean;
  settingItemIdForClient: string;
}

export interface PlayerOverlayRendererAutoplay {
  playerOverlayAutoplayRenderer: PlayerOverlayAutoplayRenderer;
}

export interface PlayerOverlayAutoplayRenderer {
  title: LiveIndicatorText;
  videoTitle: ShortViewCountText;
  byline: Byline;
  pauseText: LiveIndicatorText;
  background: BackgroundClass;
  countDownSecs: number;
  cancelButton: CancelButton;
  nextButton: CancelButton;
  trackingParams: string;
  closeButton: CloseButtonClass;
  thumbnailOverlays: PlayerOverlayAutoplayRendererThumbnailOverlay[];
  preferImmediateRedirect: boolean;
  videoId: VideoID;
  publishedTimeText: LiveIndicatorText;
  webShowNewAutonavCountdown: boolean;
  webShowBigThumbnailEndscreen: boolean;
  shortViewCountText: ShortViewCountText;
  countDownSecsForFullscreen: number;
}

export interface PlayerOverlayAutoplayRendererThumbnailOverlay {
  thumbnailOverlayTimeStatusRenderer: PurpleThumbnailOverlayTimeStatusRenderer;
}

export interface PurpleThumbnailOverlayTimeStatusRenderer {
  text: ShortViewCountText;
  style: ThumbnailOverlayTimeStatusRendererStyle;
}

export type ThumbnailOverlayTimeStatusRendererStyle = "DEFAULT" | "LIVE";

export interface PlayerOverlayRendererDecoratedPlayerBarRenderer {
  decoratedPlayerBarRenderer: DecoratedPlayerBarRendererDecoratedPlayerBarRenderer;
}

export interface DecoratedPlayerBarRendererDecoratedPlayerBarRenderer {
  playerBar?: PlayerBar;
}

export interface PlayerBar {
  multiMarkersPlayerBarRenderer: MultiMarkersPlayerBarRenderer;
}

export interface MultiMarkersPlayerBarRenderer {
  visibleOnLoad: VisibleOnLoad;
  trackingParams: string;
}

export interface EndScreen {
  watchNextEndScreenRenderer: WatchNextEndScreenRenderer;
}

export interface WatchNextEndScreenRenderer {
  results: WatchNextEndScreenRendererResult[];
  title: LiveIndicatorText;
  trackingParams: string;
}

export interface WatchNextEndScreenRendererResult {
  endScreenVideoRenderer: EndScreenVideoRenderer;
}

export interface EndScreenVideoRenderer {
  videoId: string;
  thumbnail: BackgroundClass;
  title: ShortViewCountText;
  shortBylineText: Byline;
  lengthText?: ShortViewCountText;
  lengthInSeconds?: number;
  navigationEndpoint: EndScreenVideoRendererNavigationEndpoint;
  trackingParams: string;
  shortViewCountText: ShortViewCountTextClass;
  publishedTimeText: LiveIndicatorText;
  thumbnailOverlays: EndScreenVideoRendererThumbnailOverlay[];
}

export interface EndScreenVideoRendererNavigationEndpoint {
  clickTrackingParams: string;
  commandMetadata: AutoplayVideoCommandMetadata;
  watchEndpoint: PurpleWatchEndpoint;
}

export interface EndScreenVideoRendererThumbnailOverlay {
  thumbnailOverlayTimeStatusRenderer?: FluffyThumbnailOverlayTimeStatusRenderer;
  thumbnailOverlayNowPlayingRenderer?: ThumbnailOverlayNowPlayingRenderer;
}

export interface ThumbnailOverlayNowPlayingRenderer {
  text: Subtitle;
}

export interface FluffyThumbnailOverlayTimeStatusRenderer {
  text: ShortViewCountTextClass;
  style: ThumbnailOverlayTimeStatusRendererStyle;
  icon?: Icon;
}

export interface FullscreenQuickActionsBar {
  quickActionsViewModel: QuickActionsViewModel;
}

export interface QuickActionsViewModel {
  quickActionButtons: QuickActionButton[];
}

export interface QuickActionButton {
  likeButtonViewModel?: LikeButtonViewModelLikeButtonViewModel;
  dislikeButtonViewModel?: DislikeButtonViewModelDislikeButtonViewModel;
  toggleButtonViewModel?: QuickActionButtonToggleButtonViewModel;
  buttonViewModel?: QuickActionButtonButtonViewModel;
}

export interface QuickActionButtonToggleButtonViewModel {
  defaultButtonViewModel: TentacledDefaultButtonViewModel;
  toggledButtonViewModel: FluffyToggledButtonViewModel;
  trackingParams: string;
  toggledStateEntitySelectorType: string;
}

export interface TentacledDefaultButtonViewModel {
  buttonViewModel: IndigoButtonViewModel;
}

export interface IndigoButtonViewModel {
  iconName: string;
  onTap: BraggadociousOnTap;
  accessibilityText: string;
  style: PrimaryButtonStyle;
  trackingParams: string;
  isFullWidth?: boolean;
  type: ButtonViewModelType;
  buttonSize: PurpleButtonSize;
  state: StateEnum;
  accessibilityId?: string;
  enableIconButton: boolean;
  tooltip?: string;
}

export interface BraggadociousOnTap {
  serialCommand?: IndecentSerialCommand;
  innertubeCommand?: FriskyInnertubeCommand;
}

export interface FriskyInnertubeCommand {
  clickTrackingParams: string;
  showEngagementPanelEndpoint: InnertubeCommandHideEngagementPanelEndpoint;
}

export interface IndecentSerialCommand {
  commands: Command4[];
}

export interface Command4 {
  logGestureCommand?: LogGestureCommand;
  innertubeCommand?: PurpleInnertubeCommand;
}

export interface FluffyToggledButtonViewModel {
  buttonViewModel: IndecentButtonViewModel;
}

export interface IndecentButtonViewModel {
  iconName: string;
  onTap: OnTap1;
  accessibilityText: string;
  style: PrimaryButtonStyle;
  trackingParams: string;
  isFullWidth?: boolean;
  type: ButtonViewModelType;
  buttonSize: PurpleButtonSize;
  state: StateEnum;
  accessibilityId?: string;
  enableIconButton: boolean;
  tooltip?: string;
}

export interface OnTap1 {
  serialCommand?: HilariousSerialCommand;
  innertubeCommand?: MischievousInnertubeCommand;
}

export interface MischievousInnertubeCommand {
  clickTrackingParams: string;
  hideEngagementPanelEndpoint: InnertubeCommandHideEngagementPanelEndpoint;
}

export interface HilariousSerialCommand {
  commands: Command5[];
}

export interface Command5 {
  logGestureCommand?: LogGestureCommand;
  innertubeCommand?: BraggadociousInnertubeCommand;
}

export interface BraggadociousInnertubeCommand {
  clickTrackingParams: string;
  setLiveChatCollapsedStateAction: SetLiveChatCollapsedStateAction;
}

export interface SetLiveChatCollapsedStateAction {
  collapsed: boolean;
}

export interface ShareButtonClass {
  buttonRenderer: ShareButtonButtonRenderer;
}

export interface ShareButtonButtonRenderer {
  style: TentacledStyle;
  size: DownloadButtonRendererSize;
  isDisabled: boolean;
  icon: Icon;
  navigationEndpoint?: TentacledNavigationEndpoint;
  tooltip?: string;
  trackingParams: string;
  serviceEndpoint?: IndigoServiceEndpoint;
  accessibilityData?: DisabledAccessibilityData;
  loggingDirectives?: ButtonRendererLoggingDirectives;
}

export interface TentacledNavigationEndpoint {
  clickTrackingParams: string;
  commandMetadata?: ContinuationEndpointCommandMetadata;
  shareEntityServiceEndpoint?: ShareEntityServiceEndpoint;
  openPopupAction?: InnertubeCommandOpenPopupAction;
}

export interface IndigoServiceEndpoint {
  clickTrackingParams: string;
  commandMetadata: OnResponseReceivedEndpointCommandMetadata;
  signalServiceEndpoint: FluffySignalServiceEndpoint;
}

export interface FluffySignalServiceEndpoint {
  signal: SignalServiceEndpointSignal;
  actions: HilariousAction[];
}

export interface HilariousAction {
  clickTrackingParams: string;
  openPopupAction: IndigoOpenPopupAction;
}

export interface IndigoOpenPopupAction {
  popup: AmbitiousPopup;
  popupType: string;
}

export interface AmbitiousPopup {
  voiceSearchDialogRenderer: VoiceSearchDialogRenderer;
}

export interface VoiceSearchDialogRenderer {
  placeholderHeader: Subtitle;
  promptHeader: Subtitle;
  exampleQuery1: Subtitle;
  exampleQuery2: Subtitle;
  promptMicrophoneLabel: Subtitle;
  loadingHeader: Subtitle;
  connectionErrorHeader: Subtitle;
  connectionErrorMicrophoneLabel: Subtitle;
  permissionsHeader: Subtitle;
  permissionsSubtext: Subtitle;
  disabledHeader: Subtitle;
  disabledSubtext: Subtitle;
  microphoneButtonAriaLabel: Subtitle;
  exitButton: ClearButtonClass;
  trackingParams: string;
  microphoneOffPromptHeader: Subtitle;
}

export interface ClearButtonClass {
  buttonRenderer: ClearButtonButtonRenderer;
}

export interface ClearButtonButtonRenderer {
  style: StyleTypeEnum;
  size: DownloadButtonRendererSize;
  isDisabled: boolean;
  icon: Icon;
  trackingParams: string;
  accessibilityData: DisabledAccessibilityData;
}

export type TentacledStyle =
  | "STYLE_OPACITY"
  | "STYLE_DEFAULT"
  | "STYLE_UNKNOWN";

export interface ShowPlaybackRateUpsellPanelCommand {
  clickTrackingParams: string;
  commandMetadata: ShowPlaybackRateUpsellPanelCommandCommandMetadata;
  showDialogCommand: ShowDialogCommand;
}

export interface ShowDialogCommand {
  panelLoadingStrategy: ShowDialogCommandPanelLoadingStrategy;
}

export interface SpeedmasterUserEdu {
  speedmasterEduViewModel: SpeedmasterEduViewModel;
}

export interface SpeedmasterEduViewModel {
  bodyText: BodyText;
}

export interface PlayerOverlayRendererVideoDetails {
  playerOverlayVideoDetailsRenderer: PlayerOverlayVideoDetailsRenderer;
}

export interface PlayerOverlayVideoDetailsRenderer {
  title: LiveIndicatorText;
  subtitle: Subtitle;
  channelAvatar: ChannelAvatar;
  onTap: PlayerOverlayVideoDetailsRendererOnTap;
}

export interface ChannelAvatar {
  avatarViewModel: ChannelAvatarAvatarViewModel;
}

export interface ChannelAvatarAvatarViewModel {
  image: VideoAttributeViewModelImage;
  avatarImageSize: string;
}

export interface PlayerOverlayVideoDetailsRendererOnTap {
  clickTrackingParams: string;
  showEngagementPanelEndpoint: OnTapShowEngagementPanelEndpoint;
}

export interface InitialDataResponseContext {
  serviceTrackingParams: ServiceTrackingParam[];
  mainAppWebResponseContext: MainAppWebResponseContext;
  webResponseContextExtensionData: PurpleWebResponseContextExtensionData;
}

export interface MainAppWebResponseContext {
  datasyncId: string;
  loggedOut: boolean;
  trackingParam: string;
}

export interface ServiceTrackingParam {
  service: Service;
  params: Param[];
}

export interface Param {
  key: string;
  value: string;
}

export type Service = "CSI" | "GFEEDBACK" | "GUIDED_HELP" | "ECATCHER";

export interface PurpleWebResponseContextExtensionData {
  webResponseContextPreloadData: WebResponseContextPreloadData;
  ytConfigData: YtConfigData;
  webPrefetchData: WebPrefetchData;
  hasDecorated: boolean;
}

export interface WebPrefetchData {
  navigationEndpoints: NavigationEndpointElement[];
}

export interface WebResponseContextPreloadData {
  preloadMessageNames: string[];
}

export interface YtConfigData {
  visitorData: string;
  sessionIndex: number;
  rootVisualElementType: number;
}

export interface Topbar {
  desktopTopbarRenderer: DesktopTopbarRenderer;
}

export interface DesktopTopbarRenderer {
  logo: DesktopTopbarRendererLogo;
  searchbox: Searchbox;
  trackingParams: string;
  countryCode: string;
  topbarButtons: TopbarButton[];
  hotkeyDialog: HotkeyDialog;
  backButton: BackButtonClass;
  forwardButton: BackButtonClass;
  a11ySkipNavigationButton: A11YSkipNavigationButton;
  voiceSearchButton: ShareButtonClass;
}

export interface BackButtonClass {
  buttonRenderer: BackButtonButtonRenderer;
}

export interface BackButtonButtonRenderer {
  trackingParams: string;
  command: OnResponseReceivedEndpoint;
}

export interface HotkeyDialog {
  hotkeyDialogRenderer: HotkeyDialogRenderer;
}

export interface HotkeyDialogRenderer {
  title: Subtitle;
  sections: HotkeyDialogRendererSection[];
  dismissButton: A11YSkipNavigationButton;
  trackingParams: string;
}

export interface HotkeyDialogRendererSection {
  hotkeyDialogSectionRenderer: HotkeyDialogSectionRenderer;
}

export interface HotkeyDialogSectionRenderer {
  title: Subtitle;
  options: Option[];
}

export interface Option {
  hotkeyDialogSectionOptionRenderer: HotkeyDialogSectionOptionRenderer;
}

export interface HotkeyDialogSectionOptionRenderer {
  label: Subtitle;
  hotkey: string;
  hotkeyAccessibilityLabel?: DisabledAccessibilityData;
}

export interface DesktopTopbarRendererLogo {
  topbarLogoRenderer: TopbarLogoRenderer;
}

export interface TopbarLogoRenderer {
  iconImage: Icon;
  tooltipText: Subtitle;
  endpoint: InnertubeCommandClass;
  trackingParams: string;
  overrideEntityKey: string;
}

export interface Searchbox {
  fusionSearchboxRenderer: FusionSearchboxRenderer;
}

export interface FusionSearchboxRenderer {
  icon: Icon;
  placeholderText: Subtitle;
  config: FusionSearchboxRendererConfig;
  trackingParams: string;
  searchEndpoint: FusionSearchboxRendererSearchEndpoint;
  clearButton: ClearButtonClass;
}

export interface FusionSearchboxRendererConfig {
  webSearchboxConfig: WebSearchboxConfig;
}

export interface WebSearchboxConfig {
  requestLanguage: string;
  requestDomain: string;
  hasOnscreenKeyboard: boolean;
  focusSearchbox: boolean;
}

export interface FusionSearchboxRendererSearchEndpoint {
  clickTrackingParams: string;
  commandMetadata: AutoplayVideoCommandMetadata;
  searchEndpoint: SearchEndpointSearchEndpoint;
}

export interface SearchEndpointSearchEndpoint {
  query: string;
}

export interface TopbarButton {
  buttonRenderer?: TopbarButtonButtonRenderer;
  notificationTopbarButtonRenderer?: NotificationTopbarButtonRenderer;
  topbarMenuButtonRenderer?: TopbarMenuButtonRenderer;
}

export interface TopbarButtonButtonRenderer {
  style: StyleTypeEnum;
  size: DownloadButtonRendererSize;
  text: Subtitle;
  icon: Icon;
  trackingParams: string;
  command: Command6;
}

export interface Command6 {
  clickTrackingParams: string;
  openPopupAction: IndecentOpenPopupAction;
}

export interface IndecentOpenPopupAction {
  popup: CunningPopup;
  popupType: string;
}

export interface CunningPopup {
  multiPageMenuRenderer: PurpleMultiPageMenuRenderer;
}

export interface PurpleMultiPageMenuRenderer {
  sections: MultiPageMenuRendererSection[];
  trackingParams: string;
  style: string;
}

export interface MultiPageMenuRendererSection {
  multiPageMenuSectionRenderer: MultiPageMenuSectionRenderer;
}

export interface MultiPageMenuSectionRenderer {
  items: MultiPageMenuSectionRendererItem[];
  trackingParams: string;
}

export interface MultiPageMenuSectionRendererItem {
  compactLinkRenderer: CompactLinkRenderer;
}

export interface CompactLinkRenderer {
  icon: Icon;
  title: Subtitle;
  navigationEndpoint: CompactLinkRendererNavigationEndpoint;
  trackingParams: string;
  style: CompactLinkRendererStyle;
}

export interface CompactLinkRendererNavigationEndpoint {
  clickTrackingParams: string;
  commandMetadata: ChannelNavigationEndpointCommandMetadata;
  uploadEndpoint?: AdsEngagementPanelContentRenderer;
  signalNavigationEndpoint?: Signal;
  browseEndpoint?: CommandBrowseEndpoint;
}

export type CompactLinkRendererStyle = "COMPACT_LINK_STYLE_TYPE_CREATION_MENU";

export interface NotificationTopbarButtonRenderer {
  icon: Icon;
  menuRequest: NotificationTopbarButtonRendererMenuRequest;
  style: string;
  trackingParams: string;
  accessibility: DisabledAccessibilityData;
  tooltip: string;
  updateUnseenCountEndpoint: UpdateUnseenCountEndpoint;
  notificationCount: number;
  handlerDatas: string[];
}

export interface NotificationTopbarButtonRendererMenuRequest {
  clickTrackingParams: string;
  commandMetadata: OnResponseReceivedEndpointCommandMetadata;
  signalServiceEndpoint: MenuRequestSignalServiceEndpoint;
}

export interface MenuRequestSignalServiceEndpoint {
  signal: string;
  actions: AmbitiousAction[];
}

export interface AmbitiousAction {
  clickTrackingParams: string;
  openPopupAction: HilariousOpenPopupAction;
}

export interface HilariousOpenPopupAction {
  popup: MagentaPopup;
  popupType: string;
  beReused: boolean;
}

export interface MagentaPopup {
  multiPageMenuRenderer: FluffyMultiPageMenuRenderer;
}

export interface FluffyMultiPageMenuRenderer {
  trackingParams: string;
  style: string;
  showLoadingSpinner: boolean;
}

export interface UpdateUnseenCountEndpoint {
  clickTrackingParams: string;
  commandMetadata: ContinuationEndpointCommandMetadata;
  signalServiceEndpoint: Signal;
}

export interface TopbarMenuButtonRenderer {
  avatar: TopbarMenuButtonRendererAvatar;
  menuRequest: TopbarMenuButtonRendererMenuRequest;
  trackingParams: string;
  accessibility: DisabledAccessibilityData;
  tooltip: string;
}

export interface TopbarMenuButtonRendererAvatar {
  thumbnails: ThumbnailElement[];
  accessibility: DisabledAccessibilityData;
}

export interface TopbarMenuButtonRendererMenuRequest {
  clickTrackingParams: string;
  commandMetadata: ContinuationEndpointCommandMetadata;
  signalServiceEndpoint: MenuRequestSignalServiceEndpoint;
}

export interface InitialPlayerResponse {
  responseContext: InitialPlayerResponseResponseContext;
  playabilityStatus: PlayabilityStatus;
  streamingData?: StreamingData;
  heartbeatParams?: HeartbeatParams;
  playerAds?: PlayerAd[];
  playbackTracking?: PlaybackTracking;
  videoDetails: InitialPlayerResponseVideoDetails;
  playerConfig?: PlayerConfig;
  storyboards?: Storyboards;
  microformat: InitialPlayerResponseMicroformat;
  cards?: Cards;
  trackingParams: string;
  no_ads?: NoAd[];
  auxiliaryUi: AuxiliaryUI;
  adBreakHeartbeatParams: string;
  frameworkUpdates: InitialPlayerResponseFrameworkUpdates;
  captions?: Captions;
  annotations?: Annotation[];
  paidContentOverlay?: PaidContentOverlay;
}

export interface Annotation {
  playerAnnotationsExpandedRenderer: PlayerAnnotationsExpandedRenderer;
}

export interface PlayerAnnotationsExpandedRenderer {
  featuredChannel: FeaturedChannel;
  allowSwipeDismiss: boolean;
  annotationId: string;
}

export interface FeaturedChannel {
  startTimeMs: string;
  endTimeMs: string;
  watermark: BackgroundClass;
  trackingParams: string;
  navigationEndpoint: InnertubeCommandClass;
  channelName: string;
  subscribeButton: FeaturedChannelSubscribeButton;
}

export interface FeaturedChannelSubscribeButton {
  subscribeButtonRenderer: FluffySubscribeButtonRenderer;
}

export interface FluffySubscribeButtonRenderer {
  buttonText: Subtitle;
  subscribed: boolean;
  enabled: boolean;
  type: string;
  channelId: ID;
  showPreferences: boolean;
  subscribedButtonText: Subtitle;
  unsubscribedButtonText: Subtitle;
  trackingParams: string;
  unsubscribeButtonText: Subtitle;
  serviceEndpoints: ServiceEndpointElement[];
  subscribeAccessibility: DisabledAccessibilityData;
  unsubscribeAccessibility: DisabledAccessibilityData;
}

export interface AuxiliaryUI {
  messageRenderers: MessageRenderers;
}

export interface MessageRenderers {
  bkaEnforcementMessageViewModel: BkaEnforcementMessageViewModel;
}

export interface BkaEnforcementMessageViewModel {
  title: BulletListItemTitle;
  primaryButton: PrimaryButton;
  secondaryButton: SecondaryButton;
  logo: LogoDarkClass;
  feedbackMessage: FeedbackMessage;
  trackingParams: string;
  bulletList: BulletList;
  logoDark: LogoDarkClass;
  impressionEndpoints: ImpressionEndpoint[];
  displayType: string;
  isVisible: boolean;
}

export interface BulletList {
  bulletListItems: BulletListItem[];
}

export interface BulletListItem {
  title: BulletListItemTitle;
}

export interface BulletListItemTitle {
  content: string;
  styleRuns: TitleStyleRun[];
}

export interface TitleStyleRun {
  startIndex: number;
  length: number;
}

export interface FeedbackMessage {
  content: string;
  commandRuns: FeedbackMessageCommandRun[];
  styleRuns: FeedbackMessageStyleRun[];
}

export interface FeedbackMessageCommandRun {
  startIndex: number;
  length: number;
  onTap: OnTap2;
}

export interface OnTap2 {
  innertubeCommand: InnertubeCommand1;
}

export interface InnertubeCommand1 {
  clickTrackingParams: string;
  sendFeedbackAction: SendFeedbackAction;
}

export interface SendFeedbackAction {
  bucket: string;
  productId: string;
  enableAnonymousFeedback: boolean;
}

export interface FeedbackMessageStyleRun {
  startIndex: number;
  length: number;
  fontColor?: number;
}

export interface ImpressionEndpoint {
  innertubeCommand: ImpressionEndpointInnertubeCommand;
}

export interface ImpressionEndpointInnertubeCommand {
  clickTrackingParams: string;
  commandMetadata?: ContinuationEndpointCommandMetadata;
  feedbackEndpoint?: FluffyFeedbackEndpoint;
  openAdAllowlistInstructionCommand?: OpenAdAllowlistInstructionCommand;
}

export interface FluffyFeedbackEndpoint {
  feedbackToken: string;
  uiActions: UIActions;
}

export interface OpenAdAllowlistInstructionCommand {
  fundingChoiceInstructionPageUrl: URL;
}

export interface PrimaryButton {
  title: string;
  onTap: PrimaryButtonOnTap;
  accessibilityText: string;
  style: PrimaryButtonStyle;
  trackingParams: string;
  type: string;
  buttonSize: PrimaryButtonButtonSize;
  state: StateEnum;
  iconTrailing: boolean;
}

export interface PrimaryButtonOnTap {
  parallelCommand: PurpleParallelCommand;
}

export interface PurpleParallelCommand {
  commands: ImpressionEndpoint[];
}

export interface SecondaryButton {
  title: string;
  onTap: SecondaryButtonOnTap;
  accessibilityText: string;
  style: PrimaryButtonStyle;
  trackingParams: string;
  type: ButtonViewModelType;
  buttonSize: PrimaryButtonButtonSize;
  state: StateEnum;
  iconTrailing: boolean;
}

export interface SecondaryButtonOnTap {
  parallelCommand: FluffyParallelCommand;
}

export interface FluffyParallelCommand {
  commands: ParallelCommandCommand[];
}

export interface ParallelCommandCommand {
  innertubeCommand: InnertubeCommand2;
}

export interface InnertubeCommand2 {
  clickTrackingParams: string;
  commandMetadata: TentacledCommandMetadata;
  feedbackEndpoint?: FluffyFeedbackEndpoint;
  browseEndpoint?: EndpointBrowseEndpoint;
}

export interface Captions {
  playerCaptionsTracklistRenderer: PlayerCaptionsTracklistRenderer;
}

export interface PlayerCaptionsTracklistRenderer {
  captionTracks: CaptionTrack[];
  audioTracks: AudioTrack[];
  translationLanguages: TranslationLanguage[];
  defaultAudioTrackIndex: number;
}

export interface AudioTrack {
  captionTrackIndices: number[];
}

export interface CaptionTrack {
  baseUrl: string;
  name: LiveIndicatorText;
  vssId: string;
  languageCode: string;
  kind: string;
  isTranslatable: boolean;
  trackName: string;
}

export interface TranslationLanguage {
  languageCode: string;
  languageName: LiveIndicatorText;
}

export interface Cards {
  cardCollectionRenderer: CardCollectionRenderer;
}

export interface CardCollectionRenderer {
  cards: CardCollectionRendererCard[];
  headerText: LiveIndicatorText;
  icon: CloseButton;
  closeButton: CloseButton;
  trackingParams: string;
  allowTeaserDismiss: boolean;
  logIconVisibilityUpdates: boolean;
}

export interface CardCollectionRendererCard {
  cardRenderer: CardRenderer;
}

export interface CardRenderer {
  teaser: Teaser;
  cueRanges: CueRange[];
  trackingParams: string;
}

export interface CueRange {
  startCardActiveMs: string;
  endCardActiveMs: string;
  teaserDurationMs: string;
  iconAfterTeaserMs: string;
}

export interface Teaser {
  simpleCardTeaserRenderer: SimpleCardTeaserRenderer;
}

export interface SimpleCardTeaserRenderer {
  message: LiveIndicatorText;
  trackingParams: string;
  prominent: boolean;
  logVisibilityUpdates: boolean;
  onTapCommand: ShowLessCommandElement;
}

export interface CloseButton {
  infoCardIconRenderer: InfoCardIconRenderer;
}

export interface InitialPlayerResponseFrameworkUpdates {
  entityBatchUpdate: FluffyEntityBatchUpdate;
}

export interface FluffyEntityBatchUpdate {
  mutations: FluffyMutation[];
  timestamp: Timestamp;
}

export interface FluffyMutation {
  entityKey: string;
  type: MutationType;
  payload: FluffyPayload;
}

export interface FluffyPayload {
  offlineabilityEntity: OfflineabilityEntity;
}

export interface OfflineabilityEntity {
  key: string;
  offlineabilityRenderer?: string;
  addToOfflineButtonState: string;
  contentCheckOk?: boolean;
  racyCheckOk?: boolean;
  loggingDirectives?: RunLoggingDirectives;
}

export interface HeartbeatParams {
  intervalMilliseconds?: string;
  softFailOnError: boolean;
  heartbeatServerData: string;
  heartbeatAttestationConfig?: HeartbeatAttestationConfig;
}

export interface HeartbeatAttestationConfig {
  requiresAttestation: boolean;
}

export interface InitialPlayerResponseMicroformat {
  playerMicroformatRenderer: PlayerMicroformatRenderer;
}

export interface PlayerMicroformatRenderer {
  thumbnail: BackgroundClass;
  embed: Embed;
  title: LiveIndicatorText;
  description: LiveIndicatorText;
  lengthSeconds: string;
  ownerProfileUrl: string;
  externalChannelId: ID;
  isFamilySafe: boolean;
  availableCountries: string[];
  isUnlisted: boolean;
  hasYpcMetadata: boolean;
  viewCount: string;
  category: string;
  publishDate: Date;
  ownerChannelName: string;
  liveBroadcastDetails?: LiveBroadcastDetails;
  uploadDate: Date;
  isShortsEligible: boolean;
  externalVideoId: ExternalVideoIDEnum;
  likeCount: string;
  canonicalUrl: string;
}

export interface Embed {
  iframeUrl: string;
  width: number;
  height: number;
}

export interface LiveBroadcastDetails {
  isLiveNow: boolean;
  startTimestamp: Date;
  endTimestamp?: Date;
}

export interface NoAd {
  adSlotRenderer: AdSlotRenderer;
}

export interface AdSlotRenderer {
  adSlotMetadata: AdSlotMetadata;
  fulfillmentContent: FulfillmentContent;
  slotEntryTrigger: SlotEntryTrigger;
  slotFulfillmentTriggers: SlotFulfillmentTrigger[];
  slotExpirationTriggers: SlotExpirationTrigger[];
  trackingParams: string;
}

export interface AdSlotMetadata {
  slotId: string;
  slotType: SlotType;
  adSlotLoggingData: AdSlotLoggingData;
  triggerEvent: TriggerEvent;
  triggeringSourceLayoutId?: string;
}

export interface AdSlotLoggingData {
  serializedSlotAdServingDataEntry: string;
}

export type SlotType =
  | "SLOT_TYPE_PLAYER_BYTES"
  | "SLOT_TYPE_ABOVE_FEED"
  | "SLOT_TYPE_IN_PLAYER";

export type TriggerEvent =
  | "SLOT_TRIGGER_EVENT_BEFORE_CONTENT"
  | "SLOT_TRIGGER_EVENT_LAYOUT_ID_ENTERED"
  | "SLOT_TRIGGER_EVENT_LAYOUT_ID_EXITED_NORMAL";

export interface FulfillmentContent {
  fulfilledLayout: FulfilledLayout;
}

export interface FulfilledLayout {
  playerBytesAdLayoutRenderer?: FulfilledLayoutPlayerBytesAdLayoutRenderer;
  aboveFeedAdLayoutRenderer?: AboveFeedAdLayoutRenderer;
  inPlayerAdLayoutRenderer?: InPlayerAdLayoutRenderer;
}

export interface AboveFeedAdLayoutRenderer {
  adLayoutMetadata: AboveFeedAdLayoutRendererAdLayoutMetadata;
  renderingContent: AboveFeedAdLayoutRendererRenderingContent;
  layoutExitNormalTriggers: AboveFeedAdLayoutRendererLayoutExitNormalTrigger[];
}

export interface AboveFeedAdLayoutRendererAdLayoutMetadata {
  layoutId: string;
  layoutType: string;
  adLayoutLoggingData: AdLayoutLoggingData;
}

export interface AdLayoutLoggingData {
  serializedAdServingDataEntry: string;
}

export interface AboveFeedAdLayoutRendererLayoutExitNormalTrigger {
  id: string;
  layoutExitedForReasonTrigger?: LayoutExitedForReasonTrigger;
  onDifferentLayoutIdEnteredTrigger?: OnDifferentLayoutIDEnteredTrigger;
}

export interface LayoutExitedForReasonTrigger {
  triggeringLayoutId: string;
  layoutExitReason: LayoutExitReason;
}

export type LayoutExitReason =
  | "LAYOUT_EXIT_REASON_NORMAL"
  | "LAYOUT_EXIT_REASON_ERROR";

export interface OnDifferentLayoutIDEnteredTrigger {
  triggeringLayoutId: string;
  slotType: SlotType;
  layoutType: string;
}

export interface AboveFeedAdLayoutRendererRenderingContent {
  adsEngagementPanelLayoutViewModel?: AdsEngagementPanelLayoutViewModel;
  topBannerImageTextIconButtonedLayoutViewModel?: TopBannerImageTextIconButtonedLayoutViewModel;
}

export interface AdsEngagementPanelLayoutViewModel {
  addAction: AddAction;
  expandAction: ExpandAction;
  hideAction: ExpandAction;
  removeAction: RemoveAction;
  adLayoutLoggingData: AdLayoutLoggingData;
  adVideoId: string;
  loggingDirectives: ButtonRendererLoggingDirectives;
}

export interface AddAction {
  innertubeCommand: AddActionInnertubeCommand;
}

export interface AddActionInnertubeCommand {
  clickTrackingParams: string;
  updateEngagementPanelAction: PurpleUpdateEngagementPanelAction;
}

export interface PurpleUpdateEngagementPanelAction {
  targetId: PanelIdentifier;
  header: UpdateEngagementPanelActionHeader;
  content: FriskyContent;
}

export interface FriskyContent {
  adsEngagementPanelContentRenderer: PurpleAdsEngagementPanelContentRenderer;
}

export interface PurpleAdsEngagementPanelContentRenderer {
  contentRenderer: ContentRenderer;
}

export interface ContentRenderer {
  panelTextIconTextGridCardsSubLayoutContentViewModel: PanelTextIconTextGridCardsSubLayoutContentViewModel;
}

export interface PanelTextIconTextGridCardsSubLayoutContentViewModel {
  interaction: PanelTextIconTextGridCardsSubLayoutContentViewModelInteraction;
  adButton: AdButtonClass;
  adGridCardCollection: AdGridCardCollection;
  loggingDirectives: ButtonRendererLoggingDirectives;
}

export interface AdButtonClass {
  adButtonViewModel: AdButtonViewModel;
}

export interface AdButtonViewModel {
  interaction: AdButtonViewModelInteraction;
  style: AdButtonViewModelStyle;
  size: AdButtonViewModelSize;
  label: BodyText;
  trackingParams: string;
  loggingDirectives: RunLoggingDirectives;
  iconImage?: IconImage;
}

export interface AdButtonViewModelInteraction {
  accessibility: AccessibilityData;
  onTap: InteractionOnTap;
}

export type AdButtonViewModelSize = "AD_BUTTON_SIZE_DEFAULT";

export type AdButtonViewModelStyle =
  | "AD_BUTTON_STYLE_MONO_TONAL"
  | "AD_BUTTON_STYLE_TRANSPARENT"
  | "AD_BUTTON_STYLE_MONO_FILLED"
  | "AD_BUTTON_STYLE_FILLED_WHITE";

export interface AdGridCardCollection {
  adGridCardCollectionViewModel: AdViewModel;
}

export interface AdViewModel {
  interaction: BeforeContentVideoIDStartedTrigger;
  gridCards?: GridCard[];
  style: AdBadgeViewModelStyle;
  loggingDirectives: RunLoggingDirectives;
  label?: BodyText;
}

export interface GridCard {
  adGridCardTextViewModel: AdGridCardTextViewModel;
}

export interface AdGridCardTextViewModel {
  interaction: AdGridCardTextViewModelInteraction;
  title: BodyText;
  descriptions?: BodyText[];
  moreInfoButton: AdButtonClass;
  loggingDirectives: RunLoggingDirectives;
}

export interface AdGridCardTextViewModelInteraction {
  onTap: InteractionOnTap;
}

export type AdBadgeViewModelStyle =
  | "AD_GRID_CARD_COLLECTION_STYLE_FIXED_ONE_COLUMN"
  | "AD_BADGE_STYLE_STARK";

export interface PanelTextIconTextGridCardsSubLayoutContentViewModelInteraction {
  onFirstVisible: OnFirstVisible;
}

export interface OnFirstVisible {
  performOnceCommand: PerformOnceCommand;
}

export interface PerformOnceCommand {
  identifier: string;
  command: PerformOnceCommandCommand;
}

export interface PerformOnceCommandCommand {
  innertubeCommand: InnertubeCommand3;
}

export interface InnertubeCommand3 {
  loggingUrls: PtrackingURL[];
  pingingEndpoint: AdsEngagementPanelContentRenderer;
}

export interface UpdateEngagementPanelActionHeader {
  panelAdHeaderImageLockupViewModel: PanelAdHeaderImageLockupViewModel;
}

export interface PanelAdHeaderImageLockupViewModel {
  interaction: BeforeContentVideoIDStartedTrigger;
  adImage: AdImage;
  adAvatarLockup: PanelAdHeaderImageLockupViewModelAdAvatarLockup;
  adButton: AdButtonClass;
  menu: PanelAdHeaderImageLockupViewModelMenu;
  toggleButton: ToggleButton;
  loggingDirectives: RunLoggingDirectives;
}

export interface PanelAdHeaderImageLockupViewModelAdAvatarLockup {
  adAvatarLockupViewModel: PurpleAdAvatarLockupViewModel;
}

export interface PurpleAdAvatarLockupViewModel {
  interaction: PurpleInteraction;
  style: string;
  adAvatar: AdAvatarClass;
  headline: BodyText;
  adBadge: AdBadge;
  primaryDetailsLine: PrimaryDetailsLine;
  loggingDirectives: RunLoggingDirectives;
}

export interface AdAvatarClass {
  adAvatarViewModel: AvatarAdAvatarViewModel;
}

export interface AvatarAdAvatarViewModel {
  interaction: BeforeContentVideoIDStartedTrigger;
  style: AdAvatarViewModelStyle;
  image: LogoDarkClass;
  size: AdAvatarViewModelSize;
  trackingParams: string;
  rendererContext?: ThumbnailBadgeViewModelRendererContext;
  loggingDirectives: RunLoggingDirectives;
}

export type AdAvatarViewModelSize = "AD_AVATAR_SIZE_M";

export type AdAvatarViewModelStyle =
  | "AD_AVATAR_STYLE_CIRCULAR"
  | "AD_AVATAR_STYLE_ROUNDED_CORNER";

export interface AdBadge {
  adBadgeViewModel: AdViewModel;
}

export interface PurpleInteraction {
  accessibility: AccessibilityData;
}

export interface PrimaryDetailsLine {
  adDetailsLineViewModel: PrimaryDetailsLineAdDetailsLineViewModel;
}

export interface PrimaryDetailsLineAdDetailsLineViewModel {
  style: string;
  attributes: Attribute[];
}

export interface Attribute {
  text: BodyText;
}

export interface AdImage {
  adImageViewModel: AdImageViewModel;
}

export interface AdImageViewModel {
  interaction: AdGridCardTextViewModelInteraction;
  imageSources: ThumbnailElement[];
  loggingDirectives: RunLoggingDirectives;
}

export interface PanelAdHeaderImageLockupViewModelMenu {
  buttonViewModel: MenuButtonViewModel;
}

export interface MenuButtonViewModel {
  iconName: IconName;
  onTap: OnTap3;
  accessibilityText: string;
  style: string;
  trackingParams: string;
  buttonSize: PrimaryButtonButtonSize;
  state: StateEnum;
  tooltip: string;
  loggingDirectives: ButtonRendererLoggingDirectives;
}

export interface OnTap3 {
  innertubeCommand: InnertubeCommand4;
}

export interface InnertubeCommand4 {
  clickTrackingParams: string;
  openPopupAction: InnertubeCommandOpenPopupAction;
}

export interface ToggleButton {
  toggleButtonViewModel: ToggleButtonToggleButtonViewModel;
}

export interface ToggleButtonToggleButtonViewModel {
  defaultButtonViewModel: ButtonViewModel;
  toggledButtonViewModel: ButtonViewModel;
  isToggled: boolean;
  trackingParams: string;
}

export interface ButtonViewModel {
  buttonViewModel: HilariousButtonViewModel;
}

export interface HilariousButtonViewModel {
  onTap: ExpandAction;
  style: FluffyStyle;
  trackingParams: string;
  type: ButtonViewModelType;
  buttonSize: PrimaryButtonButtonSize;
  state: StateEnum;
  iconImage: IconImageElement;
}

export interface ExpandAction {
  innertubeCommand: ShowLessCommandElement;
}

export interface RemoveAction {
  innertubeCommand: RemoveActionInnertubeCommand;
}

export interface RemoveActionInnertubeCommand {
  clickTrackingParams: string;
  updateEngagementPanelAction: FluffyUpdateEngagementPanelAction;
}

export interface FluffyUpdateEngagementPanelAction {
  targetId: PanelIdentifier;
  header: BeforeContentVideoIDStartedTrigger;
  content: MischievousContent;
}

export interface MischievousContent {
  adsEngagementPanelContentRenderer: AdsEngagementPanelContentRenderer;
}

export interface TopBannerImageTextIconButtonedLayoutViewModel {
  interaction: AdGridCardTextViewModelInteraction;
  adImage: AdImage;
  adAvatarLockup: TopBannerImageTextIconButtonedLayoutViewModelAdAvatarLockup;
  adButton: AdButtonClass;
  menu: PanelAdHeaderImageLockupViewModelMenu;
  adVideoId: string;
  adLayoutLoggingData: AdLayoutLoggingData;
  loggingDirectives: ButtonRendererLoggingDirectives;
}

export interface TopBannerImageTextIconButtonedLayoutViewModelAdAvatarLockup {
  adAvatarLockupViewModel: FluffyAdAvatarLockupViewModel;
}

export interface FluffyAdAvatarLockupViewModel {
  interaction: AdButtonViewModelInteraction;
  style: string;
  adAvatar: AdAvatar;
  headline: BodyText;
  adBadge: AdBadge;
  primaryDetailsLine: PrimaryDetailsLine;
  loggingDirectives: RunLoggingDirectives;
}

export interface AdAvatar {
  adAvatarViewModel: PurpleAdAvatarViewModel;
}

export interface PurpleAdAvatarViewModel {
  interaction: AdGridCardTextViewModelInteraction;
  style: AdAvatarViewModelStyle;
  image: LogoDarkClass;
  size: string;
  trackingParams: string;
  rendererContext?: ThumbnailBadgeViewModelRendererContext;
  loggingDirectives: RunLoggingDirectives;
}

export interface InPlayerAdLayoutRenderer {
  adLayoutMetadata: AboveFeedAdLayoutRendererAdLayoutMetadata;
  renderingContent: InPlayerAdLayoutRendererRenderingContent;
  layoutExitNormalTriggers: InPlayerAdLayoutRendererLayoutExitNormalTrigger[];
}

export interface InPlayerAdLayoutRendererLayoutExitNormalTrigger {
  id: string;
  layoutIdExitedTrigger: EdTrigger;
}

export interface EdTrigger {
  triggeringLayoutId: string;
}

export interface InPlayerAdLayoutRendererRenderingContent {
  playerOverlayLayoutRenderer?: PlayerOverlayLayoutRenderer;
  videoInterstitialButtonedCenteredLayoutRenderer?: VideoInterstitialButtonedCenteredLayoutRenderer;
}

export interface PlayerOverlayLayoutRenderer {
  interaction: BeforeContentVideoIDStartedTrigger;
  skipOrPreview: SkipOrPreview;
  playerAdCard: PlayerAdCard;
  visitAdvertiserLink: VisitAdvertiserLink;
  adBadgeRenderer: AdBadge;
  adDurationRemaining: AdDurationRemaining;
  adInfoRenderer: AdInfoRenderer;
  adLayoutLoggingData: AdLayoutLoggingData;
  layoutId: string;
  inPlayerLayoutId: string;
  adPodIndex: AdPodIndex;
  loggingDirectives: ButtonRendererLoggingDirectives;
}

export interface AdDurationRemaining {
  adDurationRemainingRenderer: AdDurationRemainingRenderer;
}

export interface AdDurationRemainingRenderer {
  templatedCountdown: TemplatedCountdown;
  trackingParams: string;
}

export interface TemplatedCountdown {
  templatedAdText: TemplatedAdText;
}

export interface TemplatedAdText {
  text: string;
  isTemplated: boolean;
  trackingParams: string;
}

export interface AdInfoRenderer {
  adHoverTextButtonRenderer: AdHoverTextButtonRenderer;
}

export interface AdHoverTextButtonRenderer {
  button: AdHoverTextButtonRendererButton;
  hoverText: LiveIndicatorText;
  trackingParams: string;
}

export interface AdHoverTextButtonRendererButton {
  buttonRenderer: StickyButtonRenderer;
}

export interface StickyButtonRenderer {
  style: PurpleStyle;
  size: DownloadButtonRendererSize;
  isDisabled: boolean;
  icon: Icon;
  navigationEndpoint: InnertubeCommand4;
  trackingParams: string;
  accessibilityData: DisabledAccessibilityData;
  loggingDirectives: ButtonRendererLoggingDirectives;
}

export interface AdPodIndex {
  adPodIndexViewModel: AdPodIndexViewModel;
}

export interface AdPodIndexViewModel {
  adPodIndex: BodyText;
  visibilityCondition: string;
}

export interface PlayerAdCard {
  playerAdAvatarLockupCardButtonedViewModel: PlayerAdAvatarLockupCardButtonedViewModel;
}

export interface PlayerAdAvatarLockupCardButtonedViewModel {
  interaction: AdGridCardTextViewModelInteraction;
  avatar: AdAvatarClass;
  headline: BodyText;
  description: BodyText;
  button: AdButtonClass;
  startMs: number;
  loggingDirectives: RunLoggingDirectives;
}

export interface SkipOrPreview {
  skipAdViewModel: SkipAdViewModel;
}

export interface SkipAdViewModel {
  interaction: BeforeContentVideoIDStartedTrigger;
  preskipState: PreskipState;
  skippableState: Skip;
  skipOffsetMilliseconds: number;
  loggingDirectives: RunLoggingDirectives;
}

export interface PreskipState {
  adPreviewViewModel: AdPreviewViewModel;
}

export interface AdPreviewViewModel {
  interaction: BeforeContentVideoIDStartedTrigger;
  previewText: PreviewText;
  previewImage: LogoDarkClass;
  durationMilliseconds: number;
  loggingDirectives: RunLoggingDirectives;
}

export interface PreviewText {
  text: string;
  isTemplated: boolean;
}

export interface Skip {
  skipAdButtonViewModel: SkipAdButtonViewModel;
}

export interface SkipAdButtonViewModel {
  interaction: SkipAdButtonViewModelInteraction;
  label: string;
  loggingDirectives: RunLoggingDirectives;
}

export interface SkipAdButtonViewModelInteraction {
  onTap?: ExpandAction;
}

export interface VisitAdvertiserLink {
  visitAdvertiserLinkViewModel: VisitAdvertiserLinkViewModel;
}

export interface VisitAdvertiserLinkViewModel {
  interaction: AdGridCardTextViewModelInteraction;
  label: BodyText;
  trackingParams: string;
  loggingDirectives: RunLoggingDirectives;
}

export interface VideoInterstitialButtonedCenteredLayoutRenderer {
  interaction: PanelTextIconTextGridCardsSubLayoutContentViewModelInteraction;
  adAvatar: AdAvatar;
  headline: Headline;
  adDetailsLine: AdDetailsLine;
  adButton: AdButtonClass;
  adBadge: AdBadge;
  adInfoRenderer: AdInfoRenderer;
  skipAdButton: Skip;
  imageBackground: ImageBackground;
  countdownViewModel: CountdownViewModel;
  durationMilliseconds: number;
  rendererContext: VideoInterstitialButtonedCenteredLayoutRendererRendererContext;
}

export interface AdDetailsLine {
  adDetailsLineViewModel: AdDetailsLineAdDetailsLineViewModel;
}

export interface AdDetailsLineAdDetailsLineViewModel {
  interaction: AdGridCardTextViewModelInteraction;
  style: string;
  attributes: Attribute[];
  loggingDirectives: RunLoggingDirectives;
}

export interface CountdownViewModel {
  timedPieCountdownViewModel: TimedPieCountdownViewModel;
}

export interface TimedPieCountdownViewModel {
  interaction: BeforeContentVideoIDStartedTrigger;
  loggingDirectives: RunLoggingDirectives;
}

export interface Headline {
  content: string;
  commandRuns: HeadlineCommandRun[];
}

export interface HeadlineCommandRun {
  loggingDirectives?: InfoCardIconRenderer;
  onTap?: InteractionOnTap;
}

export interface ImageBackground {
  imageBackgroundViewModel: ImageBackgroundViewModel;
}

export interface ImageBackgroundViewModel {
  image: LogoDarkClass;
  blurLevel: number;
  gradient: string;
  rendererContext: ImageBackgroundViewModelRendererContext;
}

export interface ImageBackgroundViewModelRendererContext {
  loggingContext: TentacledLoggingContext;
}

export interface TentacledLoggingContext {
  loggingDirectives: InfoCardIconRenderer;
}

export interface VideoInterstitialButtonedCenteredLayoutRendererRendererContext {
  loggingContext: StickyLoggingContext;
}

export interface StickyLoggingContext {
  loggingDirectives: FluffyLoggingDirectives;
}

export interface FluffyLoggingDirectives {
  trackingParams: string;
  attentionLogging: AttentionLogging;
}

export interface FulfilledLayoutPlayerBytesAdLayoutRenderer {
  adLayoutMetadata: PurpleAdLayoutMetadata;
  renderingContent: PurpleRenderingContent;
  layoutExitNormalTriggers: PlayerBytesAdLayoutRendererLayoutExitNormalTrigger[];
  layoutExitSkipTriggers: LayoutExitTrigger[];
  layoutExitMuteTriggers: LayoutExitTrigger[];
}

export interface PurpleAdLayoutMetadata {
  layoutId: string;
  layoutType: string;
}

export interface LayoutExitTrigger {
  id: string;
  skipRequestedTrigger: EdTrigger;
}

export interface PlayerBytesAdLayoutRendererLayoutExitNormalTrigger {
  id: string;
  onLayoutSelfExitRequestedTrigger: EdTrigger;
}

export interface PurpleRenderingContent {
  playerBytesSequentialLayoutRenderer: PlayerBytesSequentialLayoutRenderer;
}

export interface PlayerBytesSequentialLayoutRenderer {
  sequentialLayouts: SequentialLayout[];
}

export interface SequentialLayout {
  playerBytesAdLayoutRenderer: SequentialLayoutPlayerBytesAdLayoutRenderer;
}

export interface SequentialLayoutPlayerBytesAdLayoutRenderer {
  adLayoutMetadata: AboveFeedAdLayoutRendererAdLayoutMetadata;
  renderingContent: FluffyRenderingContent;
}

export interface FluffyRenderingContent {
  instreamVideoAdRenderer?: InstreamVideoAdRenderer;
  adActionInterstitialRenderer?: AdActionInterstitialRenderer;
}

export interface AdActionInterstitialRenderer {
  durationMilliseconds: number;
  completionCommands: ShowLessCommandElement[];
  trackingParams: string;
  abandonCommands: AbandonCommands;
  skipPings: PtrackingURL[];
  layoutId: string;
}

export interface AbandonCommands {
  commands: AbandonCommandsCommand[];
}

export interface AbandonCommandsCommand {
  clickTrackingParams: string;
  loggingUrls: PtrackingURL[];
  pingingEndpoint: AdsEngagementPanelContentRenderer;
}

export interface InstreamVideoAdRenderer {
  skipOffsetMilliseconds: number;
  pings: Pings;
  clickthroughEndpoint: ClickthroughEndpointClass;
  csiParameters: Param[];
  playerVars: string;
  elementId: string;
  trackingParams: string;
  legacyInfoCardVastExtension: string;
  sodarExtensionData: SodarExtensionData;
  externalVideoId: string;
  adLayoutLoggingData: AdLayoutLoggingData;
  layoutId: string;
}

export interface Pings {
  impressionPings: PtrackingURL[];
  errorPings: PtrackingURL[];
  mutePings: PtrackingURL[];
  unmutePings: PtrackingURL[];
  pausePings: PtrackingURL[];
  rewindPings: PtrackingURL[];
  resumePings: PtrackingURL[];
  skipPings: PtrackingURL[];
  closePings: PtrackingURL[];
  progressPings: ProgressPing[];
  activeViewViewablePings: PtrackingURL[];
  activeViewMeasurablePings: PtrackingURL[];
  abandonPings: PtrackingURL[];
  activeViewFullyViewableAudibleHalfDurationPings: PtrackingURL[];
  completePings: PtrackingURL[];
  activeViewTracking: ActiveViewTracking;
}

export interface ActiveViewTracking {
  trafficType: string;
  identifier: string;
}

export interface ProgressPing {
  baseUrl: string;
  offsetMilliseconds: number;
}

export interface SodarExtensionData {
  siub: string;
  bgub: string;
  scs: string;
  bgp: string;
}

export interface SlotEntryTrigger {
  id: string;
  beforeContentVideoIdStartedTrigger?: BeforeContentVideoIDStartedTrigger;
  layoutIdEnteredTrigger?: EdTrigger;
  layoutExitedForReasonTrigger?: LayoutExitedForReasonTrigger;
}

export interface SlotExpirationTrigger {
  id: string;
  slotIdExitedTrigger?: SlotIDEdTrigger;
  onNewPlaybackAfterContentVideoIdTrigger?: BeforeContentVideoIDStartedTrigger;
  layoutExitedForReasonTrigger?: LayoutExitedForReasonTrigger;
}

export interface SlotIDEdTrigger {
  triggeringSlotId: string;
}

export interface SlotFulfillmentTrigger {
  id: string;
  slotIdEnteredTrigger?: SlotIDEdTrigger;
  slotIdScheduledTrigger?: SlotIDEdTrigger;
}

export interface PaidContentOverlay {
  paidContentOverlayRenderer: PaidContentOverlayRenderer;
}

export interface PaidContentOverlayRenderer {
  text: LiveIndicatorText;
  durationMs: string;
  navigationEndpoint: PaidContentOverlayRendererNavigationEndpoint;
  icon: Icon;
  showInPip: boolean;
  trackingParams: string;
}

export interface PaidContentOverlayRendererNavigationEndpoint {
  clickTrackingParams: string;
  commandMetadata: AutoplayVideoCommandMetadata;
  urlEndpoint: FluffyURLEndpoint;
}

export interface FluffyURLEndpoint {
  url: string;
  target: TargetEnum;
  grwOpenInOverride: string;
}

export interface PlayabilityStatus {
  status: string;
  playableInEmbed: boolean;
  offlineability?: Offlineability;
  liveStreamability?: LiveStreamability;
  miniplayer: Miniplayer;
  contextParams: string;
  reason?: string;
}

export interface LiveStreamability {
  liveStreamabilityRenderer: LiveStreamabilityRenderer;
}

export interface LiveStreamabilityRenderer {
  videoId: ExternalVideoIDEnum;
  broadcastId?: string;
  pollDelayMs: string;
  offlineSlate?: OfflineSlate;
}

export interface OfflineSlate {
  liveStreamOfflineSlateRenderer: LiveStreamOfflineSlateRenderer;
}

export interface LiveStreamOfflineSlateRenderer {
  scheduledStartTime: string;
  mainText: Subtitle;
  subtitleText: LiveIndicatorText;
  thumbnail: BackgroundClass;
  actionButtons: ActionButtonElement[];
  offlineSlateStyle: string;
}

export interface ActionButtonElement {
  toggleButtonRenderer: ToggleButtonRenderer;
}

export interface ToggleButtonRenderer {
  isToggled: boolean;
  isDisabled: boolean;
  defaultIcon: Icon;
  defaultText: LiveIndicatorText;
  defaultServiceEndpoint: DefaultServiceEndpoint;
  toggledIcon: Icon;
  toggledText: LiveIndicatorText;
  toggledServiceEndpoint: ToggledServiceEndpoint;
  trackingParams: string;
}

export interface DefaultServiceEndpoint {
  clickTrackingParams: string;
  commandMetadata: ContinuationEndpointCommandMetadata;
  addUpcomingEventReminderEndpoint: YpcGetOffersEndpoint;
}

export interface ToggledServiceEndpoint {
  clickTrackingParams: string;
  commandMetadata: ContinuationEndpointCommandMetadata;
  removeUpcomingEventReminderEndpoint: YpcGetOffersEndpoint;
}

export interface Miniplayer {
  miniplayerRenderer: MiniplayerRenderer;
}

export interface MiniplayerRenderer {
  playbackMode: string;
}

export interface Offlineability {
  offlineabilityRenderer: OfflineabilityRenderer;
}

export interface OfflineabilityRenderer {
  offlineable: boolean;
  infoRenderer?: InfoRenderer;
  clickTrackingParams: string;
  formats?: OfflineabilityRendererFormat[];
}

export interface OfflineabilityRendererFormat {
  name: Subtitle;
  formatType: string;
  availabilityType: string;
  savedSettingShouldExpire: boolean;
}

export interface InfoRenderer {
  dismissableDialogRenderer: DismissableDialogRenderer;
}

export interface DismissableDialogRenderer {
  dialogMessage: string;
  trackingParams: string;
  title: string;
}

export interface PlaybackTracking {
  videostatsPlaybackUrl: PtrackingURL;
  videostatsDelayplayUrl: PtrackingURL;
  videostatsWatchtimeUrl: PtrackingURL;
  ptrackingUrl: PtrackingURL;
  qoeUrl: PtrackingURL;
  atrUrl: AtrURLClass;
  videostatsScheduledFlushWalltimeSeconds: number[];
  videostatsDefaultFlushIntervalSeconds: number;
  youtubeRemarketingUrl?: AtrURLClass;
}

export interface AtrURLClass {
  baseUrl: string;
  elapsedMediaTimeSeconds: number;
}

export interface PlayerAd {
  playerLegacyDesktopWatchAdsRenderer: PlayerLegacyDesktopWatchAdsRenderer;
}

export interface PlayerLegacyDesktopWatchAdsRenderer {
  playerAdParams: PlayerAdParams;
  gutParams: GutParams;
  showCompanion: boolean;
  showInstream: boolean;
  useGut: boolean;
}

export interface PlayerAdParams {
  showContentThumbnail: boolean;
  enabledEngageTypes: string;
}

export interface PlayerConfig {
  granularVariableSpeedConfig: GranularVariableSpeedConfig;
  vssClientConfig: VssClientConfig;
  audioConfig: AudioConfig;
  streamSelectionConfig: StreamSelectionConfig;
  livePlayerConfig?: LivePlayerConfig;
  daiConfig: DaiConfig;
  mediaCommonConfig: MediaCommonConfig;
  webPlayerConfig: WebPlayerConfig;
  playbackStartConfig?: PlaybackStartConfig;
}

export interface AudioConfig {
  enablePerFormatLoudness: boolean;
  loudnessTargetLkfs: number;
  loudnessDb?: number;
  perceptualLoudnessDb?: number;
  trackAbsoluteLoudnessLkfs?: number;
}

export interface DaiConfig {
  allowUstreamerRequestAdconfig: boolean;
  sendSsdaiMissingAdBreakReasons: boolean;
}

export interface GranularVariableSpeedConfig {
  minimumPlaybackRate: number;
  maximumPlaybackRate: number;
}

export interface LivePlayerConfig {
  liveReadaheadSeconds: number;
  isLiveHeadPlayable: boolean;
}

export interface MediaCommonConfig {
  dynamicReadaheadConfig: DynamicReadaheadConfig;
  mediaUstreamerRequestConfig: MediaUstreamerRequestConfig;
  useServerDrivenAbr: boolean;
  serverPlaybackStartConfig: ServerPlaybackStartConfig;
  enableServerDrivenRequestCancellation?: boolean;
  platypusUseEnvoyNetFetch: boolean;
  fixLivePlaybackModelDefaultPosition: boolean;
}

export interface DynamicReadaheadConfig {
  maxReadAheadMediaTimeMs: number;
  minReadAheadMediaTimeMs: number;
  readAheadGrowthRateMs: number;
}

export interface MediaUstreamerRequestConfig {
  videoPlaybackUstreamerConfig: string;
}

export interface ServerPlaybackStartConfig {
  enable: boolean;
  playbackStartPolicy: PlaybackStartPolicy;
}

export interface PlaybackStartPolicy {
  startMinReadaheadPolicy: StartMinReadaheadPolicy[];
}

export interface StartMinReadaheadPolicy {
  minReadaheadMs: number;
}

export interface PlaybackStartConfig {
  startSeconds: number;
  startPosition: StartPosition;
}

export interface StartPosition {
  streamTimeMillis: string;
}

export interface StreamSelectionConfig {
  maxBitrate: string;
}

export interface VssClientConfig {
  vssUsePostRequest: boolean;
}

export interface WebPlayerConfig {
  useCobaltTvosDash: boolean;
  webPlayerActionsPorting: WebPlayerActionsPorting;
}

export interface WebPlayerActionsPorting {
  getSharePanelCommand: GetSharePanelCommand;
  subscribeCommand: SubscribeCommand;
  unsubscribeCommand: UnsubscribeCommand;
  addToWatchLaterCommand: AddToWatchLaterCommand;
  removeFromWatchLaterCommand: RemoveFromWatchLaterCommand;
}

export interface AddToWatchLaterCommand {
  clickTrackingParams: string;
  commandMetadata: ContinuationEndpointCommandMetadata;
  playlistEditEndpoint: ServiceEndpointPlaylistEditEndpoint;
}

export interface GetSharePanelCommand {
  clickTrackingParams: string;
  commandMetadata: ContinuationEndpointCommandMetadata;
  webPlayerShareEntityServiceEndpoint: WebPlayerShareEntityServiceEndpoint;
}

export interface WebPlayerShareEntityServiceEndpoint {
  serializedShareEntity: string;
}

export interface RemoveFromWatchLaterCommand {
  clickTrackingParams: string;
  commandMetadata: ContinuationEndpointCommandMetadata;
  playlistEditEndpoint: RemoveFromWatchLaterCommandPlaylistEditEndpoint;
}

export interface RemoveFromWatchLaterCommandPlaylistEditEndpoint {
  playlistId: PlaylistID;
  actions: CunningAction[];
}

export interface CunningAction {
  action: ActionEnum;
  removedVideoId: string;
}

export interface InitialPlayerResponseResponseContext {
  serviceTrackingParams: ServiceTrackingParam[];
  maxAgeSeconds: number;
  mainAppWebResponseContext: MainAppWebResponseContext;
  webResponseContextExtensionData: FluffyWebResponseContextExtensionData;
}

export interface FluffyWebResponseContextExtensionData {
  webResponseContextPreloadData: WebResponseContextPreloadData;
  hasDecorated: boolean;
}

export interface Storyboards {
  playerLiveStoryboardSpecRenderer?: PlayerLiveStoryboardSpecRenderer;
  playerStoryboardSpecRenderer?: PlayerStoryboardSpecRenderer;
}

export interface PlayerLiveStoryboardSpecRenderer {
  spec: string;
}

export interface PlayerStoryboardSpecRenderer {
  spec: string;
  recommendedLevel: number;
  fineScrubbingRecommendedLevel: number;
  highResolutionRecommendedLevel: number;
}

export interface StreamingData {
  expiresInSeconds: string;
  adaptiveFormats: AdaptiveFormat[];
  dashManifestUrl?: string;
  hlsManifestUrl?: string;
  serverAbrStreamingUrl: string;
  formats?: StreamingDataFormat[];
}

export interface AdaptiveFormat {
  itag: number;
  url?: string;
  mimeType: string;
  bitrate: number;
  width?: number;
  height?: number;
  quality: Quality;
  fps?: number;
  qualityLabel?: string;
  projectionType: ProjectionType;
  targetDurationSec?: number;
  maxDvrDurationSec?: number;
  qualityOrdinal: QualityOrdinal;
  highReplication?: boolean;
  audioQuality?: AudioQuality;
  audioSampleRate?: string;
  audioChannels?: number;
  initRange?: Range;
  indexRange?: Range;
  lastModified?: string;
  contentLength?: string;
  averageBitrate?: number;
  colorInfo?: ColorInfo;
  approxDurationMs?: string;
  loudnessDb?: number;
  trackAbsoluteLoudnessLkfs?: number;
  xtags?: Xtags;
  isDrc?: boolean;
  isVb?: boolean;
}

export type AudioQuality = "AUDIO_QUALITY_MEDIUM" | "AUDIO_QUALITY_LOW";

export interface ColorInfo {
  primaries: Primaries;
  transferCharacteristics: TransferCharacteristics;
  matrixCoefficients: MatrixCoefficients;
}

export type MatrixCoefficients = "COLOR_MATRIX_COEFFICIENTS_BT709";

export type Primaries = "COLOR_PRIMARIES_BT709";

export type TransferCharacteristics = "COLOR_TRANSFER_CHARACTERISTICS_BT709";

export interface Range {
  start: string;
  end: string;
}

export type ProjectionType = "RECTANGULAR";

export type Quality =
  | "hd1080"
  | "hd720"
  | "large"
  | "medium"
  | "small"
  | "tiny"
  | "hd2160"
  | "hd1440";

export type QualityOrdinal =
  | "QUALITY_ORDINAL_1080P"
  | "QUALITY_ORDINAL_720P"
  | "QUALITY_ORDINAL_480P"
  | "QUALITY_ORDINAL_360P"
  | "QUALITY_ORDINAL_240P"
  | "QUALITY_ORDINAL_144P"
  | "QUALITY_ORDINAL_UNKNOWN"
  | "QUALITY_ORDINAL_2160P"
  | "QUALITY_ORDINAL_1440P";

export type Xtags = "CggKA2RyYxIBMQ" | "CgcKAnZiEgEx";

export interface StreamingDataFormat {
  itag: number;
  url?: string;
  mimeType: string;
  bitrate: number;
  width: number;
  height: number;
  lastModified: string;
  quality: Quality;
  fps: number;
  qualityLabel: string;
  projectionType: ProjectionType;
  audioQuality: AudioQuality;
  approxDurationMs: string;
  audioSampleRate: string;
  audioChannels: number;
  qualityOrdinal: QualityOrdinal;
  contentLength?: string;
  averageBitrate?: number;
  signatureCipher?: string;
}

export interface InitialPlayerResponseVideoDetails {
  videoId: ExternalVideoIDEnum;
  title: string;
  lengthSeconds: string;
  isLive?: boolean;
  keywords?: string[];
  channelId: ID;
  isOwnerViewing: boolean;
  shortDescription: string;
  isCrawlable: boolean;
  isLiveDvrEnabled?: boolean;
  thumbnail: BackgroundClass;
  liveChunkReadahead?: number;
  allowRatings: boolean;
  viewCount: string;
  author: string;
  isLowLatencyLiveStream?: boolean;
  isPrivate: boolean;
  isUnpluggedCorpus: boolean;
  latencyClass?: string;
  isLiveContent: boolean;
  isUpcoming?: boolean;
}
