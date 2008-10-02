//
//  PBPrefsWindowController.m
//  GitX
//
//  Created by Christian Jacobsen on 02/10/2008.
//  Copyright 2008 __MyCompanyName__. All rights reserved.
//

#import "PBPrefsWindowController.h"
#import "PBGitRepository.h"

@implementation PBPrefsWindowController

# pragma mark DBPrefsWindowController overrides

- (void)setupToolbar
{
	// GENERAL
	[self addView:generalPrefsView 
			label:@"General" 
			image:[[NSImage alloc] initWithContentsOfFile:[[NSBundle mainBundle] pathForResource:@"gitx" ofType:@"icns"]]];	
	// UPDATES
	[self addView:updatesPrefsView label:@"Updates"];
}

#pragma mark -
#pragma mark Delegate methods

- (IBAction) checkGitValidity: sender
{
	// FIXME: This does not work reliably, probably due to: http://www.cocoabuilder.com/archive/message/cocoa/2008/9/10/217850
	//[badGitPathIcon setHidden:[PBGitRepository validateGit:[[NSValueTransformer valueTransformerForName:@"PBNSURLPathUserDefaultsTransfomer"] reverseTransformedValue:[gitPathController URL]]]];
}

- (void)pathCell:(NSPathCell *)pathCell willDisplayOpenPanel:(NSOpenPanel *)openPanel
{
	[openPanel setCanChooseDirectories:NO];
	[openPanel setCanChooseFiles:YES];
	[openPanel setAllowsMultipleSelection:NO];
	[openPanel setTreatsFilePackagesAsDirectories:YES];
	[openPanel setAccessoryView:gitPathOpenAccessory];
	//[[openPanel _navView] setShowsHiddenFiles:YES];
	
	gitPathOpenPanel = openPanel;
}

#pragma mark -
#pragma mark Git Path open panel actions

- (IBAction) showHideAllFiles: sender
{
	/* This produces a few warnings, not sure if they are turn-off-able. */
	[[gitPathOpenPanel _navView] setShowsHiddenFiles:[sender state] == NSOnState];
}

@end
