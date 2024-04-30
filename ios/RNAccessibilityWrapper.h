//
//  RNAccessibilityWrapper.h
//  Rubios
//
//  Created by Usman Arif on 15/11/2023.
//

#import <UIKit/UIKit.h>
#import <UIKit/UIAccessibilityContainer.h>

#import <React/RCTView.h>

@interface RNAccessibilityWrapper : RCTView

- (void) setAccessibilityFields: (NSArray *)reactTags;

@end
