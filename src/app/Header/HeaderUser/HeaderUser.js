import React, { PureComponent } from 'react';
import { CommandBar, Persona, PersonaSize } from 'office-ui-fabric-react';
import { DirectionalHint, ContextualMenuItemType } from 'office-ui-fabric-react/lib/ContextualMenu';
import './HeaderUser.scss';

export default class HeaderUser extends PureComponent {
	toggleRightPanel = () => {
	  const { setRightPanelVisible, rightPanelVisible } = this.props;
	  setRightPanelVisible(!rightPanelVisible);
	}

	render() {
	  const {
	    logout,
	    usersname,
	    setCurrentBubbleCode,
	    rightPanelVisible,
	    users_picture: usersPicture,
	  } = this.props;

	  const parts = usersname.split(' ');
	  const initials = `${parts[0][0]}${parts[1][0]}`;
	  const items = [
	    {
	      key: 'usersname',
	      menuIconProps: {
	        iconName: 'ExpandMore',
	      },
	      cacheKey: 'usersname',
	      iconProps: { iconName: 'AccountCircle' },
	      subMenuProps: {
	        directionalHint: DirectionalHint.bottomLeftEdge,
	        directionalHintFixed: true,
	        items: [
	          {
	            key: 'usersname',
	            text: usersname,
	            onRenderIcon: () => (
								<Persona
									className="profile-image"
									size={PersonaSize.size24}
									imageInitials={initials}
									imageUrl={usersPicture}
								/>
	            ),
	          }, {
	            key: 'version',
	            text: `Version ${process.env.SYNTHEIA_DT_VERSION || '1.3.0'}`,
	            className: 'version',
	          }, {
	            key: 'guide',
	            text: 'Getting Started Guide',
	            onClick: () => setCurrentBubbleCode('intro'),
	            iconProps: { iconName: 'LiveHelp' },
	          }, {
	            key: 'divider_1',
	            className: 'profile-divider',
	            itemType: ContextualMenuItemType.Divider,
	          }, {
	            key: 'logout',
	            text: 'Logout',
	            onClick: logout,
	            iconProps: { iconName: 'LockClosed' },
	          },
	        ],
	      },
	    },
	    {
	      key: 'toggle-panel',
	      text: rightPanelVisible ? 'Hide Panel' : 'Show Panel',
	      onClick: this.toggleRightPanel,
	      iconProps: {
	        iconName: 'VerticalSplit',
	      },
	    },
	  ];

	  return (
  <div className="HeaderUser">
    <CommandBar style={{ width: 228 }} items={items} />
  </div>
	  );
	}
}
