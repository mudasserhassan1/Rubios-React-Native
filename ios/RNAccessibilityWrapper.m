//
//  RNAccessibilityWrapper.m
//  Rubios
//
//  Created by Usman Arif on 15/11/2023.
//

#import <Foundation/Foundation.h>
#import "RNAccessibilityWrapper.h"
#import <UIKit/UIKit.h>

@implementation RNAccessibilityWrapper

- (void) setAccessibilityFields: (NSArray *)fields
{
  NSMutableArray *accessibleElements = [NSMutableArray arrayWithCapacity:[fields count]];
  [fields enumerateObjectsUsingBlock:^(id obj, NSUInteger idx, BOOL * stop) {
    if ([obj isKindOfClass:[UIView class]]) {
      UIView *field = obj;
      [accessibleElements addObject:field];
    }
  }];
  self.accessibilityElements = (NSArray *)accessibleElements;
}

- (bool) shouldGroupAccessibilityChildren {
  return YES;
}

@end
